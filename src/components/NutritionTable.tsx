"use client";

import React from "react";
import { NutritionItem } from "@/types/nutrition";
import { Utensils, AlertCircle } from "lucide-react";

interface NutritionTableProps {
  items: NutritionItem[];
  missingItems?: string[];
  isMock?: boolean;
}

export const NutritionTable: React.FC<NutritionTableProps> = ({
  items,
  missingItems = [],
  isMock = false,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl p-8 bg-slate-900/40 border border-slate-800 text-center text-slate-400">
        <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No se encontraron datos nutricionales para los ingredientes seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isMock && (
        <div className="rounded-xl p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Modo Demostración Activo:</strong> Se están utilizando datos nutricionales
            estimados. Para datos en tiempo real de CalorieNinjas, configura tu{" "}
            <code className="bg-amber-950/60 px-1 py-0.5 rounded font-mono">RAPIDAPI_KEY</code> en{" "}
            <code className="bg-amber-950/60 px-1 py-0.5 rounded font-mono">.env.local</code>.
          </span>
        </div>
      )}

      {missingItems.length > 0 && (
        <div className="rounded-xl p-3 bg-slate-800/60 border border-slate-700 text-slate-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />
          <span>
            No se hallaron registros en la base de datos para:{" "}
            <strong>{missingItems.join(", ")}</strong>.
          </span>
        </div>
      )}

      {/* Tabla para Escritorio */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th scope="col" className="px-5 py-3.5">Ingrediente</th>
                <th scope="col" className="px-4 py-3.5 text-right">Porción</th>
                <th scope="col" className="px-4 py-3.5 text-right text-emerald-400">Calorías</th>
                <th scope="col" className="px-4 py-3.5 text-right text-blue-400">Proteína</th>
                <th scope="col" className="px-4 py-3.5 text-right text-amber-400">Carbs</th>
                <th scope="col" className="px-4 py-3.5 text-right text-rose-400">Grasas</th>
                <th scope="col" className="px-4 py-3.5 text-right">Fibra</th>
                <th scope="col" className="px-4 py-3.5 text-right">Azúcar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {items.map((item, idx) => (
                <tr
                  key={`${item.name}-${idx}`}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-white capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                    {item.name}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-400 font-mono text-xs">
                    {item.serving_size_g}g
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-emerald-300 font-mono">
                    {Math.round(item.calories)} kcal
                  </td>
                  <td className="px-4 py-3.5 text-right text-blue-300 font-mono">
                    {item.protein_g}g
                  </td>
                  <td className="px-4 py-3.5 text-right text-amber-300 font-mono">
                    {item.carbohydrates_total_g}g
                  </td>
                  <td className="px-4 py-3.5 text-right text-rose-300 font-mono">
                    {item.fat_total_g}g
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-300 font-mono">
                    {item.fiber_g}g
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-300 font-mono">
                    {item.sugar_g}g
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tarjetas para Dispositivos Móviles */}
      <div className="sm:hidden space-y-3">
        {items.map((item, idx) => (
          <div
            key={`mobile-${item.name}-${idx}`}
            className="rounded-xl p-4 bg-slate-900/80 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-semibold text-white capitalize text-base">
                {item.name}
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {Math.round(item.calories)} kcal
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <div className="text-slate-400 text-[10px]">Proteína</div>
                <div className="font-semibold text-blue-300">{item.protein_g}g</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <div className="text-slate-400 text-[10px]">Carbs</div>
                <div className="font-semibold text-amber-300">
                  {item.carbohydrates_total_g}g
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <div className="text-slate-400 text-[10px]">Grasas</div>
                <div className="font-semibold text-rose-300">{item.fat_total_g}g</div>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Porción: {item.serving_size_g}g</span>
              <span>Fibra: {item.fiber_g}g • Azúcar: {item.sugar_g}g</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
