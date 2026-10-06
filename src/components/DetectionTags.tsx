"use client";

import React, { useState } from "react";
import { Tag, Plus, X, Eye } from "lucide-react";
import { RoboflowPrediction } from "@/types/roboflow";

interface DetectionTagsProps {
  tags: string[];
  rawPredictions?: RoboflowPrediction[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  disabled?: boolean;
}

export const DetectionTags: React.FC<DetectionTagsProps> = ({
  tags,
  rawPredictions = [],
  onAddTag,
  onRemoveTag,
  disabled = false,
}) => {
  const [newIngredient, setNewIngredient] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newIngredient.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onAddTag(trimmed);
      setNewIngredient("");
      setIsAdding(false);
    }
  };

  // Encontrar la confianza máxima para cada tag si existe en rawPredictions
  const getTagConfidence = (label: string): number | null => {
    const match = rawPredictions.find(
      (p) => p.class.toLowerCase() === label.toLowerCase()
    );
    return match ? Math.round(match.confidence * 100) : null;
  };

  return (
    <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-200">
            Ingredientes Detectados ({tags.length})
          </h4>
        </div>
        <span className="text-xs text-slate-400">
          Haz clic en &times; para descartar o agrega faltantes
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => {
          const confidence = getTagConfidence(tag);
          return (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm font-medium transition hover:border-emerald-400"
            >
              <Tag className="w-3.5 h-3.5 opacity-70" />
              <span className="capitalize">{tag}</span>
              {confidence !== null && (
                <span className="text-[10px] text-emerald-400/80 bg-emerald-900/50 px-1.5 py-0.5 rounded-full">
                  {confidence}%
                </span>
              )}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="hover:text-rose-400 p-0.5 rounded-full hover:bg-rose-950/40 transition"
                  title={`Eliminar ${tag}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          );
        })}

        {isAdding ? (
          <form onSubmit={handleSubmit} className="inline-flex items-center gap-1">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="ej. aguacate, huevo..."
              className="px-3 py-1 text-sm bg-slate-800 border border-slate-600 rounded-full text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 w-36"
              autoFocus
              disabled={disabled}
            />
            <button
              type="submit"
              disabled={disabled || !newIngredient.trim()}
              className="px-2.5 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-full transition disabled:opacity-50"
            >
              Ok
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          !disabled && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar ingrediente</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
