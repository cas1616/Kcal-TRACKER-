"use client";

import React, { useRef, useState, useCallback } from "react";
import { UploadCloud, Image as ImageIcon, Camera, X, Sparkles } from "lucide-react";
import { fileToBase64 } from "@/services/roboflow";

interface ImageUploaderProps {
  onImageSelected: (payload: { file: File; base64: string; previewUrl: string }) => void;
  onClear: () => void;
  isLoading: boolean;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onClear,
  isLoading,
  previewUrl,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).");
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        const preview = URL.createObjectURL(file);
        onImageSelected({ file, base64, previewUrl: preview });
      } catch (err) {
        console.error("Error al procesar la imagen:", err);
      }
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log("📷 [ImageUploader] Archivo seleccionado:", selectedFile.name, `(${selectedFile.size} bytes)`);
      processFile(selectedFile);
    }
    // Limpiar el valor para permitir seleccionar el mismo archivo si el usuario lo desea
    e.target.value = "";
  };

  // Cargar una imagen de demostración para pruebas rápidas
  const handleLoadDemoImage = async () => {
    try {
      // Usar un placeholder realista en alta calidad
      const demoUrl = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80";
      const response = await fetch(demoUrl);
      const blob = await response.blob();
      const file = new File([blob], "healthy-bowl-demo.jpg", { type: "image/jpeg" });
      processFile(file);
    } catch (e) {
      console.error("Error al cargar demo:", e);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/80 shadow-2xl group">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full max-h-[420px] flex items-center justify-center bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Platillo a analizar"
              className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.01]"
            />
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            {!isLoading && (
              <button
                onClick={onClear}
                className="p-2.5 rounded-full bg-slate-900/85 hover:bg-rose-900/80 text-slate-300 hover:text-white border border-slate-700 transition shadow-lg backdrop-blur-md"
                title="Cambiar imagen"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-300 text-sm">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Imagen cargada con éxito</span>
            </div>
            {!isLoading && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline-offset-4 hover:underline"
              >
                Reemplazar foto
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? "border-emerald-500 bg-emerald-950/20 scale-[1.01]"
              : "border-slate-700/80 hover:border-emerald-500/60 bg-slate-900/40 hover:bg-slate-900/60"
          }`}
        >
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Sube la foto de tu platillo
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Arrastra tu imagen aquí, haz clic para explorar o toma una fotografía instantánea con tu cámara.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
              >
                <Camera className="w-4 h-4" />
                Tomar foto / Subir archivo
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadDemoImage();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm flex items-center gap-2 transition border border-slate-700"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Cargar imagen de prueba
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
              <span>Formatos: JPG, PNG, WEBP</span>
              <span>•</span>
              <span>Recomendado: Buena iluminación</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
