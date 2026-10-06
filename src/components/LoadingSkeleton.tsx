"use client";

import React from "react";
import { Loader2, Sparkles, Cpu } from "lucide-react";

interface LoadingSkeletonProps {
  stage: "detecting" | "fetching_nutrition" | "idle";
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ stage }) => {
  if (stage === "idle") return null;

  const isDetecting = stage === "detecting";

  return (
    <div className="rounded-2xl p-6 sm:p-8 bg-slate-900/70 border border-emerald-500/30 backdrop-blur-md shadow-2xl animate-pulse space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
          {isDetecting ? (
            <Cpu className="w-6 h-6 animate-spin text-emerald-400" />
          ) : (
            <Sparkles className="w-6 h-6 text-cyan-400 animate-bounce" />
          )}
        </div>
        <div>
          <h4 className="text-base font-semibold text-white flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            {isDetecting
              ? "1. Analizando imagen con Roboflow Vision..."
              : "2. Calculando valores nutricionales en RapidAPI..."}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {isDetecting
              ? "Identificando ingredientes y alimentos en el plato."
              : "Obteniendo desglose de calorías, proteínas, carbohidratos y grasas."}
          </p>
        </div>
      </div>

      {/* Esqueleto de tarjetas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-800/60 border border-slate-700/40" />
        ))}
      </div>

      {/* Esqueleto de tabla */}
      <div className="space-y-3 pt-2">
        <div className="h-10 rounded-lg bg-slate-800/80" />
        <div className="h-12 rounded-lg bg-slate-800/40" />
        <div className="h-12 rounded-lg bg-slate-800/40" />
      </div>
    </div>
  );
};
