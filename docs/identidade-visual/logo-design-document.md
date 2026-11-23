# Documento de Especificação de Logotipo — LabApp

**Versão:** 1.0  
**Data:** Novembro de 2026  
**Setor:** EdTech — Ensino de Programação Básica e Robótica com Arduino  
**Público-Alvo:** Crianças e pré-adolescentes de 8 a 14 anos  
**Canais Prioritários:** Web / Plataforma Digital e Aplicativos Móveis (iOS e Android)

---

## 1. Resumo Executivo e Briefing Estratégico

O **LabApp** nasce com o propósito de tornar o aprendizado de programação lógica e robótica básica com Arduino acessível, leve e prazeroso para crianças e jovens de **8 a 14 anos**.

Diferente de plataformas técnicas tradicionais — frequentemente carregadas de interfaces escuras rígidas, tipografias duras e metáforas industriais — o LabApp adota uma postura **descontraída, moderna e minimalista**. Inspirado na clareza gamificada e acolhedora do **Duolingo**, o sistema visual equilibra ludicidade com calma cognitiva, utilizando formas arredondadas e uma paleta pastel centrada no azul tecnológico.

### Pilares de Personalidade da Marca

| Pilar | Tradução Visual | O que Evitar |
| :--- | :--- | :--- |
| **Descontraído** | Formas orgânicas, cantos bem arredondados, expressão amigável no símbolo | Seriedade corporativa, ângulos de 90° rígidos |
| **Moderno** | Geometria limpa, design flat pastel, suporte nativo a Light e Dark Mode | Sombras pesadas, gradientes metálicos 3D, efeitos datados |
| **Minimalista** | Símbolo com poucos elementos essenciais, alta legibilidade em micro-tamanhos | Engrenagens complexas, circuitos poluídos, excesso de detalhes |
| **Calmo e Tecnológico** | Azul pastel como cor dominante para reduzir ansiedade diante do código | Vermelhos agressivos, neons saturados cansativos |

---

## 2. Conceito Visual e Racional Criativo

### Conceito Principal: **"A Cabeça do Robô LabBot"**

O logotipo do LabApp é um **logotipo combinado** (Símbolo + Wordmark), combinando a energia amigável do **Duolingo** com a silhueta icônica da **cabeça de um robô futurista arredondado**.

1. **Silhueta de Capacete & Crista Superior:** A cabeça arredondada em **Calm Tech Blue** (`#64A8F5`) ganha personalidade imediata com uma crista central no topo, fones/sensores laterais (*ear-pods*) e duas antenas em aleta lateral na cor **Menta Arduino** (`#6CD9B4`).
2. **Visor Esculpido & Olhos Felizes (`^ ^`):** Um visor curvo estilo máscara espacial em azul profundo (`#235BB5` no Light / `#121926` no Dark) exibe dois olhos em arco sorridente (`^ ^`), transmitindo simpatia e tecnologia ao mesmo tempo.
3. **Versatilidade em Micro-tamanhos:** Ao concentrar a identidade na cabeça expressiva do robô, o símbolo mantém alto impacto visual tanto em `1024 × 1024 px` (App Icon) quanto em `16 × 16 px` (Favicon).
4. **Wordmark Bicolor (`Lab` + `App`):** Escrito em **Nunito ExtraBold (800)**, o uso de *CamelCase* melhora o reconhecimento instantâneo dos dois conceitos, diferenciando o núcleo ("Lab" em grafite/luz) do meio digital ("App" em azul tecnológico).

### Conceitos Complementares Explorados (Referência de Direção)

Caso a equipe queira testar variações futuras em campanhas ou subprodutos:
- **Direção A (Recomendada — LabBot Conectado):** Símbolo frasco-robô + LED menta flutuante. Melhor equilíbrio entre ciência, código e empatia infantil.
- **Direção B (Bloco de Código Sorridente):** Um bloco arredondado inspirado em programação em blocos (Scratch/Blockly) com dois pinos inferiores de Arduino. Útil como selo secundário dentro do aplicativo.
- **Direção C (Monograma `LA` Modular):** Ligadura minimalista entre `L` e `A` usando traço contínuo arredondado. Indicada apenas para marcas d'água institucionais ou rodapés discretos.

---

## 3. Arquitetura do Logotipo e Versões Oficiais

Todos os arquivos vetoriais base encontram-se em `lab-app/assets/`:

| Versão | Uso Recomendado | Arquivo Vetorial |
| :--- | :--- | :--- |
| **Horizontal Principal (Light)** | Cabeçalho do site, landing pages, apresentações claras | [labapp-logo-light.svg](assets/labapp-logo-light.svg) |
| **Horizontal Principal (Dark)** | Cabeçalho em modo escuro, telas de código, splash dark | [labapp-logo-dark.svg](assets/labapp-logo-dark.svg) |
| **Vertical / Empilhada** | Telas de abertura (Splash), cards de loja, banners quadrados | [labapp-logo-vertical-light.svg](assets/labapp-logo-vertical-light.svg) |
| **Símbolo Isolado** | Avatares, favicon, badges de progresso, loaders | [labapp-symbol.svg](assets/labapp-symbol.svg) |
| **App Icon (Squircle)** | App Store, Google Play e atalho na tela inicial | [labapp-app-icon.svg](assets/labapp-app-icon.svg) |

### Versões Monocromáticas
Quando aplicado sobre fundos fotográficos, selos ou impressões de uma cor:
- **Monocromática Escura:** Todo o símbolo e wordmark em `#1E2B3C` (olhos/sorriso vazados em transparência).
- **Monocromática Clara:** Todo o símbolo e wordmark em `#FFFFFF` (olhos/sorriso vazados em transparência).

---

## 4. Diretrizes de Construção, Grid e Área de Proteção

O diagrama visual de construção está disponível em [labapp-construction-grid.svg](assets/labapp-construction-grid.svg).

### Proporções e Geometria do Símbolo (Grid `64 × 64`)
- **Unidade Modular (`x`):** Equivale à metade da largura da abertura dos olhos/LEDs ou `1/4` da altura total do logotipo horizontal (`16 px` na escala base de `64 px`).
- **Curvatura e Traço:**
  - Cabeça em oval horizontal ("ovo deitado", proporção `46 × 36`, razão `1,28:1`) com crista superior (`16 × 8.5`) e sensores laterais (*ear-pods* `8 × 14.5`, `rx = 4`).
  - Antenas duplas laterais em aleta inclinada (`#6CD9B4` / `#7CE6C2`).
  - Visor esculpido horizontal (`36 × 23`, razão `1,56:1`) com leve curva nasal na base e olhos em arco feliz (`stroke-width = 3.4`, `stroke-linecap: round`).
- **Relação Símbolo × Wordmark (Horizontal):**
  - Altura do símbolo reduzida opticamente para `87,5%` da caixa (`56 px` em container de `64 px`) para alinhar visualmente a crista do capacete e o queixo do robô ao peso da fonte **Nunito 800**.
  - Espaçamento horizontal entre símbolo e texto: mínimo de `0.5x` (`8 px` na escala de `64 px`).

### Área de Proteção (Clear Space)
- Deve-se manter uma margem livre mínima de **`1x`** ao redor de todos os quatro lados da assinatura completa (onde `x` equivale a `1/4` da altura total do logotipo, ou à altura da letra minúscula `"a"` de `LabApp`).
- Nenhum texto, botão, borda de card ou elemento gráfico pode invadir essa zona de respiro.

### Tamanhos Mínimos de Reprodução

| Formato | Uso Digital (Web / Mobile) | Uso Impresso (Apoio) |
| :--- | :--- | :--- |
| **Assinatura Horizontal** | `120 px` de largura mínima | `32 mm` de largura mínima |
| **Assinatura Vertical** | `88 px` de largura mínima | `24 mm` de largura mínima |
| **Símbolo Isolado** | `24 × 24 px` (UI) / `16 × 16 px` (Favicon) | `8 × 8 mm` |

---

## 5. Sistema Cromático — Pastel, Light Mode e Dark Mode

A arquitetura cromática foi desenhada para permitir a **alternância nativa entre Light Mode e Dark Mode** no site e no aplicativo sem perda de identidade nem fadiga ocular.

- **Light Mode:** Utiliza fundos azul-gelo suaves (`#F7FAFE`) e o azul pastel `#64A8F5` como protagonista calmo e tecnológico.
- **Dark Mode:** Substitui o preto puro (`#000000`, que gera halation em telas OLED para leitores jovens) por um azul-noturno profundo (`#121926`), ajustando os tons pastéis para versões mais luminosas (`#7BB8FA`, `#7CE6C2`) a fim de preservar o contraste mínimo **WCAG AA**.

### 5.1 Paleta de Marca & Apoio Pastel (Light Mode vs Dark Mode)

| Papel Cromático | Nome da Cor | Modo | HEX | RGB | CMYK | Uso Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Primária** | **Calm Tech Blue** | Light | `#64A8F5` | `100, 168, 245` | `59, 31, 0, 4` | Símbolo, CTAs principais, estados ativos |
| **Primária (Contraste)** | **Blue Deep** | Light | `#3B82D6` | `59, 130, 214` | `72, 39, 0, 16` | Texto `"App"`, links, hover de botões |
| **Primária** | **Sky Luminous** | Dark | `#7BB8FA` | `123, 184, 250` | `51, 26, 0, 2` | Símbolo, texto `"App"`, CTAs em Dark Mode |
| **Primária (Hover)** | **Ice Blue** | Dark | `#9AC9FC` | `154, 201, 252` | `39, 20, 0, 1` | Hover de links e destaques em Dark Mode |
| **Secundária** | **Arduino Mint** | Light | `#6CD9B4` | `108, 217, 180` | `50, 0, 17, 15` | LED do símbolo, feedback de sucesso, hardware OK |
| **Secundária** | **Mint Glow** | Dark | `#7CE6C2` | `124, 230, 194` | `46, 0, 16, 10` | LED do símbolo e sucesso em Dark Mode |
| **Apoio Lúdico 1** | **Spark Lavender** | Light | `#A799F5` | `167, 153, 245` | `32, 38, 0, 4` | Módulos de lógica/código, trilhas avançadas |
| **Apoio Lúdico 1** | **Soft Violet** | Dark | `#B9AEFA` | `185, 174, 250` | `26, 30, 0, 2` | Módulos de lógica/código em Dark Mode |
| **Apoio Lúdico 2** | **Sunny Amber** | Light | `#FFD166` | `255, 209, 102` | `0, 18, 60, 0` | XP, conquistas, medalhas e ofensiva (streak) |
| **Apoio Lúdico 2** | **Warm Glow** | Dark | `#FFE08A` | `255, 224, 138` | `0, 12, 46, 0` | XP e medalhas em Dark Mode |
| **Feedback Gentil** | **Soft Coral** | Light | `#F78C8C` | `247, 140, 140` | `0, 43, 43, 3` | Alertas suaves de erro de código/circuito |
| **Feedback Gentil** | **Coral Mist** | Dark | `#FA9E9E` | `250, 158, 158` | `0, 37, 37, 2` | Alertas suaves em Dark Mode |

### 5.2 Superfícies, Fundos e Tipografia (Tokens de Interface)

#### Tema Light Mode
| Token | Nome | HEX | RGB | CMYK | Aplicação |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--lab-bg-canvas` | **Cloud White** | `#F7FAFE` | `247, 250, 254` | `3, 2, 0, 0` | Fundo global das páginas |
| `--lab-bg-surface` | **Pure White** | `#FFFFFF` | `255, 255, 255` | `0, 0, 0, 0` | Cards, modais, área de lição |
| `--lab-bg-tint` | **Mist Blue** | `#EAF2FD` | `234, 242, 253` | `8, 4, 0, 1` | Hover suave, fundo de badges |
| `--lab-border-subtle` | **Soft Slate** | `#DCE6F4` | `220, 230, 244` | `10, 6, 0, 4` | Bordas de cards e inputs |
| `--lab-text-primary` | **Deep Ink** | `#1E2B3C` | `30, 43, 60` | `50, 28, 0, 76` | Títulos, wordmark `"Lab"`, texto principal |
| `--lab-text-secondary` | **Muted Slate** | `#5C6F87` | `92, 111, 135` | `32, 18, 0, 47` | Subtítulos, legendas, placeholders |

#### Tema Dark Mode
| Token | Nome | HEX | RGB | CMYK | Aplicação |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--lab-bg-canvas` | **Midnight Lab** | `#121926` | `18, 25, 38` | `53, 34, 0, 85` | Fundo global escuro, rosto do símbolo |
| `--lab-bg-surface` | **Deep Slate** | `#1B2538` | `27, 37, 56` | `52, 34, 0, 78` | Cards, barra lateral, modais |
| `--lab-bg-tint` | **Elevated Navy** | `#24324A` | `36, 50, 74` | `51, 32, 0, 71` | Estados selecionados e hover |
| `--lab-border-subtle` | **Night Border** | `#2E3E5C` | `46, 62, 92` | `50, 33, 0, 64` | Divisores e bordas de cards |
| `--lab-text-primary` | **Soft Moon** | `#F1F6FC` | `241, 246, 252` | `4, 2, 0, 1` | Títulos, wordmark `"Lab"`, texto principal |
| `--lab-text-secondary` | **Cool Mist** | `#9FB2CC` | `159, 178, 204` | `22, 13, 0, 20` | Subtítulos, metadados, instruções |

> **Arquivos prontos para engenharia:** As variáveis prontas para web e mobile estão salvas em [theme-colors.css](tokens/theme-colors.css) e [design-tokens.json](tokens/design-tokens.json).

---

## 6. Sistema Tipográfico

### Fonte Principal (Marca & Interface): **Nunito**
- **Classificação:** Sans-serif arredondada (Google Fonts, licença Open Font License).
- **Por que funciona para 8–14 anos:** Possui terminações perfeitamente arredondadas que dialogam com os traços do símbolo, excelente abertura de contrapontos (`a`, `e`, `o`) para leitura fluida em telas pequenas e personalidade amigável sem parecer infantilizada para pré-adolescentes de 13–14 anos.
- **Alternativas homologadas (fallback):** `Quicksand`, `Varela Round`, `SF Pro Rounded` / `ui-rounded`.

#### Hierarquia e Pesos Recomendados
| Uso | Família | Peso | Tamanho Sugerido (Web/App) | Tracking / Line-Height |
| :--- | :--- | :--- | :--- | :--- |
| **Wordmark (`LabApp`)** | Nunito | ExtraBold (`800`) | Proporcional ao símbolo | `-0.02em` / `1.0` |
| **Títulos Principais (H1)** | Nunito | ExtraBold (`800`) | `28 px – 36 px` | `-0.015em` / `1.2` |
| **Subtítulos / Cards (H2–H3)** | Nunito | Bold (`700`) | `18 px – 24 px` | `0` / `1.3` |
| **Corpo de Texto & Lições** | Nunito | SemiBold (`600`) / Regular (`400`) | `16 px` (mínimo `14 px`) | `0` / `1.5` |
| **Botões & Badges** | Nunito | Bold (`700`) | `15 px – 16 px` | `+0.01em` / `1.1` |

### Fonte Secundária (Blocos de Código Arduino): **JetBrains Mono**
- Usada **exclusivamente** dentro do editor de código, snippets `C++ / Arduino` e labels de pinos (`D13`, `GND`, `5V`).
- Possui diferenciação clara entre `0` e `O`, `1`, `l` e `I` — fundamental para crianças que estão aprendendo a digitar código pela primeira vez.

### Regra Tipográfica Restritiva
- **Proibido** o uso de fontes serifadas (ex.: Times, Georgia, Merriweather), fontes condensadas rígidas ou manuscritas decorativas.

---

## 7. Aplicações Digitais e Mobile

### 7.1 Ícone de Aplicativo (iOS & Android)
- Utilizar [labapp-app-icon.svg](assets/labapp-app-icon.svg) como referência master (`1024 × 1024 px` sem transparência externa para iOS; Adaptive Icon com camada de fundo `#EAF2FD` e camada frontal centralizada na zona segura de `66%` para Android).
- O símbolo deve ocupar entre **62% e 68%** da largura total do ícone para manter respiro generoso nas bordas arredondadas dos sistemas operacionais.

### 7.2 Favicon e Navegação Web
- **Favicon:** Exportar exclusivamente o **símbolo isolado** (`16×16`, `32×32`, `180×180` Apple Touch Icon e `SVG` adaptativo). Nunca tentar colocar o texto `LabApp` dentro de um favicon.
- **Navbar com Toggle Light/Dark:**
  - No tema claro, renderizar `labapp-logo-light.svg` sobre `#FFFFFF` ou `#F7FAFE`.
  - No tema escuro, alternar para `labapp-logo-dark.svg` sobre `#121926` ou `#1B2538`, garantindo que olhos e sorriso do símbolo assumam a cor do fundo (`#121926`) em vez de branco ofuscante, suavizando o contraste visual.

### 7.3 Microinterações Sugeridas (Estilo Duolingo)
- O ponto **Menta Arduino** acima do símbolo pode pulsar suavemente ao conectar uma placa Arduino via USB/Bluetooth ou ao concluir uma lição.
- Os olhos do símbolo podem piscar rapidamente em estados de carregamento (Splash / Loading).

---

## 8. Regras de Aplicação e Uso Incorreto (Do's & Don'ts)

### O que SEMPRE fazer (Do's)
- Usar os arquivos vetoriais oficiais sem reconstruir o traço manualmente.
- Respeitar a área de proteção mínima (`1x`) em todos os layouts.
- Alternar corretamente entre a versão **Light Mode** e **Dark Mode** conforme o fundo aplicado.
- Manter cantos de botões, cards e ilustrações da interface arredondados (`12 px` a `24 px`) em harmonia com o logotipo.

### O que NUNCA fazer (Don'ts)

| Regra Violada | Descrição do Erro | Impacto na Marca |
| :--- | :--- | :--- |
| **1. Distorção de Proporção** | Esticar ou comprimir o logotipo apenas na horizontal ou vertical | Quebra a geometria amigável e passa amadorismo |
| **2. Troca de Tipografia** | Substituir `Nunito` por fontes serifadas, condensadas ou genéricas como Arial/Times | Perde leveza e deixa o visual formal demais |
| **3. Alteração de Cores Fora da Paleta** | Aplicar cores neon saturadas, preto puro (`#000000`) ou gradientes arco-íris no símbolo | Cansa a visão e destrói a calma tecnológica do azul pastel |
| **4. Baixo Contraste** | Aplicar o logotipo Light Mode sobre fundo escuro (ou Dark Mode sobre fundo claro) | Torna `"Lab"` ilegível e prejudica acessibilidade |
| **5. Remoção de Elementos Internos** | Apagar o LED menta flutuante ou alterar a expressão do rosto no logotipo oficial | Descaracteriza a dualidade laboratório + robótica |
| **6. Efeitos Pesados** | Adicionar sombras projetadas escuras, relevo 3D metálico ou contornos (strokes) grossos ao redor do texto | Conflita com a proposta moderna e minimalista |
| **7. Invasão da Área de Respiro** | Posicionar selos de "Novo", botões ou bordas colados ao símbolo | Polui a leitura em telas mobile pequenas |
| **8. Capitalização Incorreta** | Escrever `LABAPP`, `labapp` ou `Lab-App` quando usar a marca oficial | Quebra a consistência verbal e visual da marca |

---

## 9. Checklist de Entregáveis na Pasta `lab-app`

- [labapp-symbol.svg](assets/labapp-symbol.svg) — Símbolo isolado vetorial
- [labapp-logo-light.svg](assets/labapp-logo-light.svg) — Logotipo horizontal Light Mode
- [labapp-logo-dark.svg](assets/labapp-logo-dark.svg) — Logotipo horizontal Dark Mode
- [labapp-logo-vertical-light.svg](assets/labapp-logo-vertical-light.svg) — Logotipo vertical Light Mode
- [labapp-app-icon.svg](assets/labapp-app-icon.svg) — Ícone de aplicativo mobile (Squircle)
- [labapp-construction-grid.svg](assets/labapp-construction-grid.svg) — Diagrama de grid e área de proteção
- [theme-colors.css](tokens/theme-colors.css) — Variáveis CSS para Light Mode e Dark Mode
- [design-tokens.json](tokens/design-tokens.json) — Tokens estruturados para Web, iOS e Android
- [logo-design-document.md](logo-design-document.md) — Este documento completo de especificação
