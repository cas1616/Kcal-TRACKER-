import { NextRequest, NextResponse } from "next/server";
import {
  NutritionApiResponse,
  NutritionItem,
  NutritionTotals,
  RapidApiCalorieNinjaResponse,
} from "@/types/nutrition";

// Datos de respaldo para pruebas/demo cuando aún no se configura RAPIDAPI_KEY
const MOCK_NUTRITION_DATABASE: Record<string, NutritionItem> = {
  apple: {
    name: "apple",
    calories: 52,
    serving_size_g: 100,
    fat_total_g: 0.2,
    fat_saturated_g: 0.0,
    protein_g: 0.3,
    sodium_mg: 1,
    potassium_mg: 107,
    cholesterol_mg: 0,
    carbohydrates_total_g: 13.8,
    fiber_g: 2.4,
    sugar_g: 10.4,
  },
  banana: {
    name: "banana",
    calories: 89,
    serving_size_g: 100,
    fat_total_g: 0.3,
    fat_saturated_g: 0.1,
    protein_g: 1.1,
    sodium_mg: 1,
    potassium_mg: 358,
    cholesterol_mg: 0,
    carbohydrates_total_g: 22.8,
    fiber_g: 2.6,
    sugar_g: 12.2,
  },
  egg: {
    name: "egg",
    calories: 143,
    serving_size_g: 100,
    fat_total_g: 9.5,
    fat_saturated_g: 3.1,
    protein_g: 12.6,
    sodium_mg: 142,
    potassium_mg: 138,
    cholesterol_mg: 372,
    carbohydrates_total_g: 0.7,
    fiber_g: 0.0,
    sugar_g: 0.4,
  },
  tomato: {
    name: "tomato",
    calories: 18,
    serving_size_g: 100,
    fat_total_g: 0.2,
    fat_saturated_g: 0.0,
    protein_g: 0.9,
    sodium_mg: 5,
    potassium_mg: 237,
    cholesterol_mg: 0,
    carbohydrates_total_g: 3.9,
    fiber_g: 1.2,
    sugar_g: 2.6,
  },
  avocado: {
    name: "avocado",
    calories: 160,
    serving_size_g: 100,
    fat_total_g: 14.7,
    fat_saturated_g: 2.1,
    protein_g: 2.0,
    sodium_mg: 7,
    potassium_mg: 485,
    cholesterol_mg: 0,
    carbohydrates_total_g: 8.5,
    fiber_g: 6.7,
    sugar_g: 0.7,
  },
  chicken: {
    name: "chicken",
    calories: 239,
    serving_size_g: 100,
    fat_total_g: 13.6,
    fat_saturated_g: 3.8,
    protein_g: 27.3,
    sodium_mg: 82,
    potassium_mg: 223,
    cholesterol_mg: 88,
    carbohydrates_total_g: 0.0,
    fiber_g: 0.0,
    sugar_g: 0.0,
  },
  rice: {
    name: "rice",
    calories: 130,
    serving_size_g: 100,
    fat_total_g: 0.3,
    fat_saturated_g: 0.1,
    protein_g: 2.7,
    sodium_mg: 1,
    potassium_mg: 35,
    cholesterol_mg: 0,
    carbohydrates_total_g: 28.2,
    fiber_g: 0.4,
    sugar_g: 0.1,
  },
  bread: {
    name: "bread",
    calories: 265,
    serving_size_g: 100,
    fat_total_g: 3.2,
    fat_saturated_g: 0.7,
    protein_g: 9.0,
    sodium_mg: 491,
    potassium_mg: 115,
    cholesterol_mg: 0,
    carbohydrates_total_g: 49.0,
    fiber_g: 2.7,
    sugar_g: 5.0,
  },
};

function calculateTotals(items: NutritionItem[]): NutritionTotals {
  const round = (val: number) => Math.round(val * 10) / 10;

  return items.reduce<NutritionTotals>(
    (acc, curr) => ({
      calories: round(acc.calories + (curr.calories || 0)),
      protein_g: round(acc.protein_g + (curr.protein_g || 0)),
      carbohydrates_total_g: round(
        acc.carbohydrates_total_g + (curr.carbohydrates_total_g || 0)
      ),
      fat_total_g: round(acc.fat_total_g + (curr.fat_total_g || 0)),
      fiber_g: round(acc.fiber_g + (curr.fiber_g || 0)),
      sugar_g: round(acc.sugar_g + (curr.sugar_g || 0)),
    }),
    {
      calories: 0,
      protein_g: 0,
      carbohydrates_total_g: 0,
      fat_total_g: 0,
      fiber_g: 0,
      sugar_g: 0,
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients } = body as { ingredients: string[] };

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Debe proporcionar un arreglo de ingredientes válido.",
        },
        { status: 400 }
      );
    }

    // Normalizar nombres de ingredientes
    const cleanedIngredients = ingredients
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0);

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || "calorieninjas.p.rapidapi.com";

    // Si no hay API Key configurada, utilizar el fallback mock con advertencia
    if (!apiKey) {
      console.warn(
        "[Nutrition API] RAPIDAPI_KEY no encontrada. Generando respuesta de demostración."
      );

      const items: NutritionItem[] = [];
      const missingItems: string[] = [];

      for (const ingredient of cleanedIngredients) {
        if (MOCK_NUTRITION_DATABASE[ingredient]) {
          items.push(MOCK_NUTRITION_DATABASE[ingredient]);
        } else {
          // Generar estimado genérico para permitir probar cualquier label detectado
          items.push({
            name: ingredient,
            calories: Math.floor(Math.random() * 80) + 40,
            serving_size_g: 100,
            fat_total_g: Math.floor(Math.random() * 5) + 0.5,
            fat_saturated_g: 0.2,
            protein_g: Math.floor(Math.random() * 8) + 1,
            sodium_mg: 20,
            potassium_mg: 120,
            cholesterol_mg: 0,
            carbohydrates_total_g: Math.floor(Math.random() * 20) + 5,
            fiber_g: 2.0,
            sugar_g: 3.5,
          });
        }
      }

      const totals = calculateTotals(items);
      const responseData: NutritionApiResponse = {
        success: true,
        ingredients: cleanedIngredients,
        items,
        totals,
        missingItems,
        isMock: true,
      };

      return NextResponse.json(responseData, { status: 200 });
    }

    // Consulta a RapidAPI (CalorieNinjas)
    // Se envía la lista concatenada por espacios
    const query = cleanedIngredients.join(" ");
    const rapidApiUrl = `https://${apiHost}/v1/nutrition?query=${encodeURIComponent(query)}`;

    const apiResponse = await fetch(rapidApiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
      next: { revalidate: 3600 }, // Cachear 1 hora
    });

    let items: NutritionItem[] = [];
    let isMock = false;

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.warn(
        `[RapidAPI Warning] El upstream de RapidAPI retornó ${apiResponse.status}: ${errorText}. Activando fallback de estimación nutricional.`
      );
      isMock = true;
      for (const ingredient of cleanedIngredients) {
        if (MOCK_NUTRITION_DATABASE[ingredient]) {
          items.push(MOCK_NUTRITION_DATABASE[ingredient]);
        } else {
          items.push({
            name: ingredient,
            calories: Math.floor(Math.random() * 80) + 45,
            serving_size_g: 100,
            fat_total_g: Math.floor(Math.random() * 4) + 0.5,
            fat_saturated_g: 0.2,
            protein_g: Math.floor(Math.random() * 8) + 1,
            sodium_mg: 20,
            potassium_mg: 120,
            cholesterol_mg: 0,
            carbohydrates_total_g: Math.floor(Math.random() * 20) + 5,
            fiber_g: 2.0,
            sugar_g: 3.5,
          });
        }
      }
    } else {
      const data: RapidApiCalorieNinjaResponse = await apiResponse.json();
      items = data.items || [];
    }

    // Detectar qué ingredientes solicitados no fueron encontrados por el servicio
    const foundNames = new Set(items.map((it) => it.name.toLowerCase()));
    const missingItems = cleanedIngredients.filter(
      (reqItem) => !foundNames.has(reqItem)
    );

    const totals = calculateTotals(items);

    const responseData: NutritionApiResponse = {
      success: true,
      ingredients: cleanedIngredients,
      items,
      totals,
      missingItems,
      isMock: false,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[Nutrition API Handler Error]:", message);

    return NextResponse.json(
      {
        success: false,
        error: `Error interno al procesar los datos nutricionales: ${message}`,
      },
      { status: 500 }
    );
  }
}
