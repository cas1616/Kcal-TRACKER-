import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriScan AI - Escáner Nutricional Automático",
  description:
    "Detecta ingredientes con Visión Computacional (Roboflow) y calcula su valor nutricional automáticamente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Background Ambient Glows */}
          <div className="pointer-events-none fixed inset-0 z-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/3 -left-40 w-[500px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-10 -right-40 w-[600px] h-[400px] bg-teal-500/10 rounded-full blur-[130px]" />
          </div>

          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
