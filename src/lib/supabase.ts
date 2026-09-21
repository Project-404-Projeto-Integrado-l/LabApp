import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (supabaseUrl.includes("placeholder")) {
  console.warn("⚠️ Supabase URL é um placeholder. Verifique seu arquivo .env.local e reinicie o servidor dev.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type GameType = "eletronica" | "quiz" | "memorizacao";

export type DifficultyLevel = "facil" | "medio" | "dificil";

export interface Flashcard {
  id: string;
  title: string;
  category: "placas" | "sensores" | "componentes" | "atuadores" | string;
  description: string;
  image_url?: string;
  difficulty?: DifficultyLevel;
  created_at?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation?: string;
  category?: string;
  created_at?: string;
}

export interface RankingEntry {
  id: string;
  player_name: string;
  game_type: GameType;
  score: number;
  duration_seconds?: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  player_name: string;
  module_name: string;
  is_completed: boolean;
  score: number;
  updated_at: string;
}
