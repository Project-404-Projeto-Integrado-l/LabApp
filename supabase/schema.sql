-- 1. CRIAR BUCKET DE STORAGE PÚBLICO PARA ILUSTRAÇÕES DE FLASHCARDS
INSERT INTO storage.buckets (id, name, public)
VALUES ('flashcard-images', 'flashcard-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política de permissão pública para leitura do bucket
CREATE POLICY "Leitura publica de imagens dos flashcards"
ON storage.objects FOR SELECT
USING (bucket_id = 'flashcard-images');

-- Política para permitir upload no bucket
CREATE POLICY "Permitir upload de imagens dos flashcards"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'flashcard-images');


-- 2. TABELA DE FLASHCARDS (Ilustrações, peças, componentes e placas)
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'componentes', -- 'placas', 'sensores', 'componentes', 'atuadores'
    description TEXT NOT NULL,
    image_url TEXT,
    difficulty VARCHAR(20) DEFAULT 'facil', -- 'facil', 'medio', 'dificil'
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. TABELA DE PERGUNTAS DO QUIZ
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Ex: ["5V", "3.3V", "12V", " GND"]
    correct_option_index INT NOT NULL DEFAULT 0,
    explanation TEXT,
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS para tabela quiz_questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura pública de quiz_questions" ON public.quiz_questions;
CREATE POLICY "Permitir leitura pública de quiz_questions" ON public.quiz_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção pública de quiz_questions" ON public.quiz_questions;
CREATE POLICY "Permitir inserção pública de quiz_questions" ON public.quiz_questions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização pública de quiz_questions" ON public.quiz_questions;
CREATE POLICY "Permitir atualização pública de quiz_questions" ON public.quiz_questions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir deleção pública de quiz_questions" ON public.quiz_questions;
CREATE POLICY "Permitir deleção pública de quiz_questions" ON public.quiz_questions FOR DELETE USING (true);



-- 4. TABELA DE RANKING E LEADERBOARD DOS JOGOS
CREATE TABLE IF NOT EXISTS public.rankings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    game_type VARCHAR(50) NOT NULL, -- 'eletronica', 'quiz', 'memorizacao'
    score INT NOT NULL DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. TABELA DE PROGRESSO DO JOGADOR/ALUNO
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ========================================================
-- SEED DE DADOS DE EXEMPLO PARA TESTES INICIAIS NO LABAPP
-- ========================================================

-- Inserir alguns Flashcards de teste
INSERT INTO public.flashcards (title, category, description, difficulty)
VALUES
('Arduino Uno', 'placas', 'Placa de microcontrolador baseada no ATmega328P. É o cérebro principal para projetos de robótica básica.', 'facil'),
('Resistor 220Ω', 'componentes', 'Componente eletrônico passivo que limita a corrente elétrica para proteger LEDs contra queima.', 'facil'),
('LED (Diodo Emissor de Luz)', 'componentes', 'Componente semicondutor que emite luz quando a corrente elétrica flui do anodo (+) para o catodo (-).', 'facil'),
('Sensor Ultrassônico HC-SR04', 'sensores', 'Sensor que mede distâncias enviando ondas sonoras de alta frequência e calculando o tempo de retorno do eco.', 'medio'),
('Servomotor SG90', 'atuadores', 'Motor de precisão que permite controlar o ângulo de rotação (geralmente de 0° a 180°).', 'medio')
ON CONFLICT DO NOTHING;

-- Inserir algumas Perguntas do Quiz de teste
INSERT INTO public.quiz_questions (question, options, correct_option_index, explanation, category)
VALUES
('Qual pino do Arduino Uno deve ser conectado ao terminal negativo de um circuito?', '["5V", "GND", "RESET", "AREF"]', 1, 'GND significa Ground (Terra) e representa o polo negativo/referência de 0V no circuito.', 'eletronica'),
('Qual função no código do Arduino é executada repetidamente em um loop infinito?', '["setup()", "loop()", "pinMode()", "digitalWrite()"]', 1, 'A função void loop() roda continuamente enquanto o Arduino estiver ligado.', 'programacao'),
('Qual componente é essencial para evitar que um LED queime ao ser conectado a uma fonte de 5V?', '["Capacitor", "Resistor", "Potenciômetro", "Diodo Zener"]', 1, 'O resistor limita a corrente elétrica que passa pelo LED, impedindo sobrecarga térmica.', 'eletronica')
ON CONFLICT DO NOTHING;
