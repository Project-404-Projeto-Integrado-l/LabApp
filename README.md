# LabApp — Plataforma Gamificada de Ensino de Robótica e Programação
LabApp: Plataforma gamificada para o ensino lúdico e interativo de robótica básica, eletrônica e programação com Arduino. Iniciada na disciplina de IHC 1 (UFC) para atender alunos e apoiar educadores no Projeto LabiNEC através de minijogos educativos, quizzes e sistemas de progressão.

---

## Sobre o Projeto

O **LabApp** nasceu da necessidade de transformar o processo de aprendizagem em tecnologia em uma experiência prática, intuitiva e acessível. A plataforma resolve desafios comuns em sala de aula, como a dispersão de atenção, disparidade de níveis de conhecimento e a complexidade de conceitos abstratos de eletrônica e código, utilizando dinâmicas lúdicas e gamificação.

### Módulos e Minijogos
- ** Jogo de Eletrônica (Montagem de Circuitos):** Simulação interativa onde o usuário conecta componentes virtuais (placa Arduino Uno, LEDs, resistores, baterias e jumpers) com prevenção ativa de erros e feedback contextual.
- ** Jogo de Perguntas (Quiz):** Desafios de múltipla escolha focados em lógica de controle, automação e sintaxe da linguagem do Arduino.
- ** Jogo de Memorização (Flashcards Interativos):** Modos lúdico e avançado para fixação visual e conceitual de hardware, sensores e atuadores.
- ** Gamificação & Progressão:** Sistema de pontuação (XP), conquistas, estrelas de desempenho e ranking para incentivo contínuo.

---

## O Cliente e Contexto de Aplicação

* **Instituição / Projeto Beneficiário:** **Projeto LabiNEC**
* **Público-Alvo (Usuários Primários):** Crianças e adolescentes em formação inicial em tecnologia, representados por perfis que vão desde estudantes iniciantes que necessitam de forte apelo visual até alunos avançados em busca de desafios práticos.
* **Usuário Secundário / Educador:** Professor de Programação e Robótica (responsável por acompanhar métricas, engajar turmas e avaliar a evolução pedagógica).

---

## Equipe do Projeto

* **Sérgio Brener** — Design de Produto & Desenvolvimento Front-End
* **Benjamn Clécio** — Desenvolvimento & Experiência do Usuário (UX)
* **João Lucas** — Desenvolvimento & Lógica Interativa

### Supervisão Acadêmica
* **Profª. Drª. Cátia Luzia Silva**
* **Prof. Dr. Wellington Wagner Ferreira Sarmento**

*Curso de Sistemas e Mídias Digitais (SMD) — Universidade Federal do Ceará (UFC)*

---

## Arquitetura e Stack Tecnológica Proposta

A plataforma foi planejada para uma arquitetura moderna, escalável, performática e altamente responsiva para navegadores desktop e tablets.

### Tecnologias

* **Framework Principal:** **[Next.js](https://nextjs.org/) (App Router & React 19 / TypeScript)**
  * Renderização híbrida (SSR/SSG para páginas institucionais e documentação, SPA interativa para a área logada de jogos).
  * *Server Actions* e rotas de API integradas para comunicação simplificada com o backend.
* **Estilização & Design System:**
  * **[Tailwind CSS](https://tailwindcss.com/):** Agilidade e consistência visual no layout escuro/acessível planejado no design.
  * **[shadcn/ui](https://ui.shadcn.com/) & Radix UI:** Componentes acessíveis (WAI-ARIA), modais com fechamento por *overlay*, menus de navegação e diálogos de ajuda/glossário.
* **Banco de Dados & Autenticação:**
  * **[PostgreSQL](https://www.postgresql.org/):** Modelagem de dados para turmas, alunos, histórico de tentativas, pontuações e métricas de desempenho.
  * **[Auth.js (NextAuth)](https://authjs.dev/):** Autenticação segura com suporte a perfis de Aluno e Professor.

---

## Princípios de IHC Aplicados

A interface e as mecânicas foram desenhadas seguindo critérios rigorosos de Usabilidade e Heurísticas de Nielsen:
1. **Prevenção Ativa (PA):** Desativação dinâmica de botões até que pré-requisitos sejam atendidos e bloqueio de múltiplas seleções em quizzes.
2. **Prevenção Passiva (PP):** Instruções contextuais diretas ("*Clique para adicionar ao circuito*") e marcação explícita de *slots* vazios.
3. **Recuperação Apoiada (RA):** Mensagens de erro construtivas contendo pistas e dicas pedagógicas para resolução autônoma do problema.
4. **Liberdade & Controle:** Fechamento intuitivo de modais por clique externo ou atalhos de teclado.
5. **Ajuda e Documentação:** Módulo de "Como Jogar" e glossário infantil integrado para nivelamento de conhecimento técnico.

---

## Como Executar o Projeto Localmente

---

## Licença

Este projeto é desenvolvido para fins acadêmicos e educacionais sob a licença GPL-3.0. Consulte o arquivo `LICENSE` para mais detalhes.
