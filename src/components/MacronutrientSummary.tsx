"use client";

import React from "react";
import { Flame, Beef, Wheat, Droplets, Apple } from "lucide-react";
import { NutritionTotals } from "@/types/nutrition";

interface MacronutrientSummaryProps {
  totals: NutritionTotals;
  itemCount: number;
}

export const MacronutrientSummary: React.FC<MacronutrientSummaryProps> = ({
  totals,
  itemCount,
}) => {
  // Cálculo aproximado del desglose calórico por macronutriente:
  // Proteína: 4 kcal/g, Carbohidratos: 4 kcal/g, Grasas: 9 kcal/g
  const proteinKcal = totals.protein_g * 4;
  const carbsKcal = totals.carbohydrates_total_g * 4;
  const fatKcal = totals.fat_total_g * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;

  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  return (
    <div className="w-full space-y-4">
      {/* Tarjeta Principal de Calorías */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Aporte Energético Estimado</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {Math.round(totals.calories)}
              </span>
              <span className="text-slate-400 font-medium text-lg">kcal totales</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Calculado en base a {itemCount} alimento(s) detectado(s) por porción estándar (~100g c/u).
            </p>
          </div>

          {/* Gráfico de barras horizontales apiladas para macros */}
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Distribución calórica</span>
              <span className="text-emerald-400">100%</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${proteinPct}%` }}
                className="bg-blue-500 transition-all duration-500"
                title={`Proteína: ${proteinPct}%`}
              />
              <div
                style={{ width: `${carbsPct}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Carbohidratos: ${carbsPct}%`}
              />
              <div
                style={{ width: `${fatPct}%` }}
                className="bg-rose-500 transition-all duration-500"
                title={`Grasas: ${fatPct}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Proteína ({proteinPct}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Carbs ({carbsPct}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Grasas ({fatPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Macronutrientes Clave */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Proteínas */}
        <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Beef className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Proteínas</div>
            <div className="text-xl font-bold text-white">{totals.protein_g}g</div>
          </div>
        </div>

        {/* Carbohidratos */}
        <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Wheat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Carbohidratos</div>
            <div className="text-xl font-bold text-white">{totals.carbohydrates_total_g}g</div>
          </div>
        </div>

        {/* Grasas */}
        <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Grasas Totales</div>
            <div className="text-xl font-bold text-white">{totals.fat_total_g}g</div>
          </div>
        </div>

        {/* Fibra y Azúcares */}
        <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Fibra / Azúcar</div>
            <div className="text-sm font-bold text-white">
              {totals.fiber_g}g <span className="text-slate-500 font-normal">/</span> {totals.sugar_g}g
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
