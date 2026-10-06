import { DetectionResult, RoboflowPrediction, RoboflowResponse } from "@/types/roboflow";

/**
 * Convierte un File o Blob a una cadena Base64 pura (sin el prefijo data:image/...;base64,)
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Extrae de forma segura la parte posterior a la coma
      const base64Clean = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64Clean);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Envía la imagen a la API de Inferencia de Roboflow y retorna las clases detectadas sin duplicados.
 */
export async function detectFoodItems(
  imageBase64: string,
  minConfidence: number = 0.4
): Promise<DetectionResult> {
  const apiKey = process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY?.trim();
  const modelEndpoint = process.env.NEXT_PUBLIC_ROBOFLOW_MODEL_ENDPOINT?.trim();

  console.group("🔍 [Roboflow Inference Service]");
  console.log("1. Tamaño Base64:", imageBase64.length, "caracteres");
  console.log("2. Fragmento inicial Base64:", imageBase64.slice(0, 30) + "...");
  console.log("3. Endpoint configurado:", modelEndpoint);
  console.log("4. API Key configurada:", apiKey ? `${apiKey.slice(0, 6)}...` : "(vacía)");

  // Si no hay configuración de Roboflow, simular detección demostrativa
  if (!apiKey || !modelEndpoint) {
    console.warn("⚠️ Faltan credenciales de Roboflow. Activando simulación demostrativa.");
    console.groupEnd();

    const mockPredictions: RoboflowPrediction[] = [
      { x: 150, y: 120, width: 90, height: 90, confidence: 0.94, class: "apple" },
      { x: 300, y: 200, width: 140, height: 70, confidence: 0.88, class: "banana" },
      { x: 220, y: 260, width: 80, height: 80, confidence: 0.82, class: "egg" },
    ];

    const detectedLabels = Array.from(
      new Set(
        mockPredictions
          .filter((p) => p.confidence >= minConfidence)
          .map((p) => p.class.trim().toLowerCase())
      )
    );

    return {
      rawPredictions: mockPredictions,
      detectedLabels,
      executionTime: 0.25,
    };
  }

  // Normalizar la URL del endpoint
  let url = modelEndpoint;
  if (!url.startsWith("http")) {
    url = `https://detect.roboflow.com/${url}`;
  }

  const endpointUrl = new URL(url);
  endpointUrl.searchParams.set("api_key", apiKey);
  endpointUrl.searchParams.set("confidence", (minConfidence * 100).toString());

  console.log("5. Enviando petición POST a:", endpointUrl.toString().replace(apiKey, "***"));

  const response = await fetch(endpointUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: imageBase64,
  });

  console.log("6. Código de respuesta HTTP:", response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error devuelto por Roboflow:", errorText);
    console.groupEnd();
    throw new Error(
      `Error en inferencia de Roboflow (${response.status}): ${errorText || response.statusText}`
    );
  }

  const data: RoboflowResponse = await response.json();
  console.log("7. JSON crudo devuelto por Roboflow:", data);

  const predictions = data.predictions || [];
  console.log(
    "8. Predicciones detectadas:",
    predictions.map((p) => ({
      clase: p.class,
      confianza: `${Math.round(p.confidence * 100)}%`,
      caja: { x: p.x, y: p.y, w: p.width, h: p.height },
    }))
  );

  // Extraer clases únicas filtradas por umbral de confianza
  const detectedLabels = Array.from(
    new Set(
      predictions
        .filter((pred) => pred.confidence >= minConfidence)
        .map((pred) => pred.class.trim().toLowerCase())
    )
  );

  console.log("9. Clases únicas finales extraídas:", detectedLabels);
  console.groupEnd();

  return {
    rawPredictions: predictions,
    detectedLabels,
    executionTime: data.time,
  };
}
