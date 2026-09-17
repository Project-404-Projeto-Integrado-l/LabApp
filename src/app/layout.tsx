import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LabApp — Plataforma Gamificada de Ensino de Robótica",
  description: "Plataforma gamificada para o ensino lúdico e interativo de robótica básica, eletrônica e programação com Arduino.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark h-full antialiased">
      <body className="min-h-full bg-[#212121] text-white flex flex-col">{children}</body>
    </html>
  );
}
