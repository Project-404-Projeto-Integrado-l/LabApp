import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LabApp — Plataforma Gamificada de Ensino de Robótica",
  description: "Plataforma gamificada para o ensino lúdico e interativo de robótica básica, eletrônica e programação com Arduino.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`dark h-full antialiased ${exo2.variable}`}>
      <body className="min-h-full bg-[#212121] text-[#F6F6F9] font-sans flex flex-col">{children}</body>
    </html>
  );
}
