"use client";

import React, { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { DetectionTags } from "@/components/DetectionTags";
import { MacronutrientSummary } from "@/components/MacronutrientSummary";
import { NutritionTable } from "@/components/NutritionTable";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { detectFoodItems } from "@/services/roboflow";
import { NutritionApiResponse } from "@/types/nutrition";
import { RoboflowPrediction } from "@/types/roboflow";
import { Scan, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Estados de proceso
  const [loadingStage, setLoadingStage] = useState<"idle" | "detecting" | "fetching_nutrition">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resultados
  const [detectedLabels, setDetectedLabels] = useState<string[]>([]);
  const [rawPredictions, setRawPredictions] = useState<RoboflowPrediction[]>([]);
  const [nutritionData, setNutritionData] = useState<NutritionApiResponse | null>(null);

  // Función para consultar la API de nutrición con los ingredientes dados
  const fetchNutritionForLabels = async (labels: string[]) => {
    if (labels.length === 0) {
      setNutritionData(null);
      return;
    }

    setLoadingStage("fetching_nutrition");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: labels }),
      });

      const data: NutritionApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al obtener la información nutricional.");
      }

      setNutritionData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido en nutrición";
      setErrorMessage(msg);
    } finally {
      setLoadingStage("idle");
    }
  };

  // Manejador al seleccionar/subir una imagen
  const handleImageSelected = async ({
    base64,
    previewUrl,
  }: {
    file: File;
    base64: string;
    previewUrl: string;
  }) => {
    setPreviewUrl(previewUrl);
    setImageBase64(base64);
    setErrorMessage(null);
    setNutritionData(null);
    setDetectedLabels([]);
    setRawPredictions([]);

    // 1. Ejecutar inferencia de Roboflow
    setLoadingStage("detecting");
    console.log("🚀 [Page] Enviando imagen a Roboflow. Longitud base64:", base64.length);
    try {
      const detectionResult = await detectFoodItems(base64);
      console.log("🥗 [Page] Clases recibidas de Roboflow:", detectionResult.detectedLabels);
      setRawPredictions(detectionResult.rawPredictions);
      setDetectedLabels(detectionResult.detectedLabels);

      if (detectionResult.detectedLabels.length === 0) {
        setErrorMessage(
          "No se detectaron alimentos con suficiente confianza en la imagen. Puedes agregar ingredientes manualmente a continuación."
        );
        setLoadingStage("idle");
        return;
      }

      // 2. Ejecutar consulta de nutrición para las clases detectadas
      await fetchNutritionForLabels(detectionResult.detectedLabels);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error en detección";
      setErrorMessage(msg);
      setLoadingStage("idle");
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setImageBase64(null);
    setDetectedLabels([]);
    setRawPredictions([]);
    setNutritionData(null);
    setErrorMessage(null);
    setLoadingStage("idle");
  };

  const handleAddTag = async (newTag: string) => {
    const updated = [...detectedLabels, newTag];
    setDetectedLabels(updated);
    await fetchNutritionForLabels(updated);
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updated = detectedLabels.filter((t) => t !== tagToRemove);
    setDetectedLabels(updated);
    await fetchNutritionForLabels(updated);
  };

  const handleRecalculate = () => {
    if (detectedLabels.length > 0) {
      fetchNutritionForLabels(detectedLabels);
    }
  };

  const isLoading = loadingStage !== "idle";

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header & Hero */}
      <header className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
          <Scan className="w-3.5 h-3.5" />
          <span>Roboflow Vision & RapidAPI Nutrition</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Escáner Nutricional <span className="text-emerald-400">Automático</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Sube la fotografía de un platillo, detecta automáticamente sus alimentos mediante visión computacional y analiza al instante su desglose de calorías y macronutrientes.
        </p>
      </header>

      {/* Panel Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Subida de Imagen & Tags de Detección */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-sm">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Captura de Platillo</span>
              {previewUrl && (
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 disabled:opacity-50"
                >
                  Reiniciar
                </button>
              )}
            </h2>

            <ImageUploader
              onImageSelected={handleImageSelected}
              onClear={handleReset}
              isLoading={isLoading}
              previewUrl={previewUrl}
            />
          </div>

          {/* Lista interactiva de tags detectados */}
          {previewUrl && (
            <DetectionTags
              tags={detectedLabels}
              rawPredictions={rawPredictions}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              disabled={isLoading}
            />
          )}

          {/* Información de Integración / Estado de credenciales */}
          <div className="rounded-2xl p-4 bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Configuración de Servicios</span>
            </div>
            <p>
              • <strong>Roboflow:</strong> Detecta objetos en tiempo real desde modelos entrenados.
            </p>
            <p>
              • <strong>RapidAPI (CalorieNinjas):</strong> Extrae perfiles nutricionales completos.
            </p>
          </div>
        </section>

        {/* Columna Derecha: Carga, Mensajes y Resultados Nutricionales */}
        <section className="lg:col-span-7 space-y-6">
          {/* Mensajes de Error o Advertencia */}
          {errorMessage && (
            <div className="rounded-2xl p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Atención en el escaneo</p>
                <p className="text-xs text-rose-300/90 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Esqueleto de Carga */}
          {isLoading && <LoadingSkeleton stage={loadingStage} />}

          {/* Contenido Nutricional Final */}
          {!isLoading && nutritionData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Análisis Nutricional</span>
                </h3>
                <button
                  onClick={handleRecalculate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recalcular</span>
                </button>
              </div>

              {/* Resumen de Macros */}
              <MacronutrientSummary
                totals={nutritionData.totals}
                itemCount={nutritionData.items.length}
              />

              {/* Tabla Detallada por Ingrediente */}
              <NutritionTable
                items={nutritionData.items}
                missingItems={nutritionData.missingItems}
                isMock={nutritionData.isMock}
              />
            </div>
          )}

          {/* Estado Inicial vacío cuando no se ha subido imagen */}
          {!previewUrl && !isLoading && (
            <div className="rounded-3xl p-10 bg-slate-900/30 border border-dashed border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Scan className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">
                  Esperando fotografía del platillo
                </h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Sube una foto o carga el ejemplo de prueba en el panel izquierdo para comenzar el análisis automático.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center pt-8 border-t border-slate-800/80 text-xs text-slate-500">
        Escáner Nutricional Automático • Next.js App Router • Roboflow Inference API & RapidAPI
      </footer>
    </main>
  );
}
