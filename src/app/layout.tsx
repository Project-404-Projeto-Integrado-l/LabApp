import type { Metadata } from "next";
import { Nunito, JetBrains_Mono } from "next/font/google";
import { SoundProvider } from "@/providers/sound-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LabApp — Plataforma Gamificada de Ensino de Robótica",
  description:
    "Plataforma gamificada para o ensino lúdico e interativo de robótica básica, eletrônica e programação com Arduino.",
  icons: {
    icon: "/brand/labapp-symbol.svg",
    apple: "/brand/labapp-app-icon.svg",
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('labapp-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}else{document.documentElement.removeAttribute('data-theme');document.documentElement.classList.remove('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`h-full antialiased ${nunito.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-lab-canvas text-lab-text font-sans flex flex-col">
        <ThemeProvider>
          <SoundProvider>{children}</SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
