# LabApp — Plataforma Gamificada de Ensino de Robótica e Programação
LabApp: Plataforma gamificada para o ensino lúdico e interativo de robótica básica, eletrônica e programação com Arduino. Iniciada na disciplina de IHC 1 (UFC) para atender alunos e apoiar educadores no Projeto LabiNEC através de minijogos educativos, quizzes e sistemas de progressão.

---

## Sobre o Projeto

O **LabApp** nasceu da necessidade de transformar o processo de aprendizagem em tecnologia em uma experiência prática, intuitiva e acessível. A plataforma resolve desafios comuns em sala de aula, como a dispersão de atenção, disparidade de níveis de conhecimento e a complexidade de conceitos abstratos de eletrônica e código, utilizando dinâmicas lúdicas e gamificação.

### Módulos e Minijogos
- **Jogo de Eletrônica (Montagem de Circuitos):** Simulação interativa onde o usuário conecta componentes virtuais (placa Arduino Uno, LEDs, resistores, baterias e jumpers) com prevenção ativa de erros e feedback contextual.
- **Jogo de Perguntas (Quiz):** Desafios de múltipla escolha focados em lógica de controle, automação e sintaxe da linguagem do Arduino.
- **Jogo de Memorização (Flashcards Interativos):** Modos lúdico e avançado para fixação visual e conceitual de hardware, sensores e atuadores.
- **Gamificação & Progressão:** Sistema de pontuação (XP), conquistas, estrelas de desempenho e ranking para incentivo contínuo.

---

## O Cliente e Contexto de Aplicação

* **Instituição / Projeto Beneficiário:** **Projeto LabiNEC**
* **Público-Alvo (Usuários Primários):** Crianças e adolescentes em formação inicial em tecnologia, representados por perfis que vão desde estudantes iniciantes que necessitam de forte apelo visual até alunos avançados em busca de desafios práticos.
* **Usuário Secundário / Educador:** Professor de Programação e Robótica (responsável por acompanhar métricas, engajar turmas e avaliar a evolução pedagógica).

---

## Equipe do Projeto

* **Sérgio Brener** — UI/UX Design, Programação & Testes
* **Benjamn Clécio** — Programação & Testes
* **João Lucas** — Gestão & Testes
* **Maria Rosa** — Arte/Design
* **Murilo Marcondes** — Gestão & Testes

### Supervisão Acadêmica
* **Profª. Drª. Cátia Luzia Oliveira da Silva**
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

### Requisitos Funcionais (RF)

| Identificador | Descrição | Prioridade | Depende de | Situação |
| :--- | :--- | :--- | :--- | :--- |
| **RF01** | O usuário deve conseguir cadastrar e gerenciar seu perfil na aplicação, definindo sua categoria como aluno ou professor. | Alta | Nenhum | `EM DESENVOLVIMENTO` |
| **RF02** | O usuário deve ser capaz de navegar livremente entre as telas de Início, Catálogo de Jogos, Ranking e Configurações. | Alta | RF01 | `EM DESENVOLVIMENTO` |
| **RF03** | O usuário deve conseguir acessar a central de suporte contendo instruções de "Como Jogar" e o Glossário de Termos. | Média | RF02 | `EM DESENVOLVIMENTO` |
| **RF04** | O sistema deve permitir que o professor/administrador cadastre, edite, liste e remova perguntas, alternativas e gabaritos para os quizzes. | Alta | Nenhum | `EM DESENVOLVIMENTO` |
| **RF05** | O jogo deve exibir as perguntas de forma individual com o enunciado e o indicador de progresso (ex.: "Pergunta 01/03"). | Alta | RF04 | `EM DESENVOLVIMENTO` |
| **RF06** | O sistema deve permitir ao usuário selecionar apenas uma única alternativa por pergunta. | Alta | RF05 | `EM DESENVOLVIMENTO` |
| **RF07** | O jogo deve validar a alternativa escolhida e apresentar retorno visual imediato sobre a correção da resposta. | Alta | RF06 | `EM DESENVOLVIMENTO` |
| **RF08** | O sistema deve computar a pontuação de XP ao final do quiz com base no desempenho alcançado pelo usuário. | Alta | RF07, RF22 | `EM DESENVOLVIMENTO` |
| **RF09** | O sistema deve disponibilizar um catálogo de imagens, nomes e descrições dos componentes para o jogo de memorização. | Alta | Nenhum | `EM DESENVOLVIMENTO` |
| **RF10** | O usuário deve poder alternar livremente entre o "Modo Lúdico" e o "Modo Avançado" no jogo de memorização. | Média | RF09 | `EM DESENVOLVIMENTO` |
| **RF11** | O usuário deve ser capaz de acionar a ação "Virar Flashcard" para visualizar os detalhes e a imagem do componente. | Alta | RF09 | `EM DESENVOLVIMENTO` |
| **RF12** | O usuário deve associar o componente apresentado em tela à sua opção de identificação correta. | Alta | RF09, RF11 | `EM DESENVOLVIMENTO` |
| **RF13** | O sistema deve bloquear a confirmação de resposta nula e exibir mensagem de aviso caso nenhuma opção seja marcada. | Média | RF12 | `EM DESENVOLVIMENTO` |
| **RF14** | O jogo deve exibir o objetivo prático do circuito elétrico a ser montado na fase atual (ex.: "Ligar um LED com Arduino"). | Alta | Nenhum | `EM DESENVOLVIMENTO` |
| **RF15** | O sistema deve apresentar a biblioteca de componentes disponíveis (Arduino Uno, LED, Resistor, Bateria 9V, Jumper). | Alta | Nenhum | `EM DESENVOLVIMENTO` |
| **RF16** | O usuário deve poder alocar peças selecionadas da biblioteca nos slots disponíveis na bancada de montagem. | Alta | RF15 | `EM DESENVOLVIMENTO` |
| **RF17** | O jogo deve indicar visualmente o status de cada posição da bancada (ex.: "Slot X Vazio" ou ícone do componente alocado). | Média | RF16 | `EM DESENVOLVIMENTO` |
| **RF18** | O jogo deve habilitar o botão "Validar Circuito" somente após o preenchimento da quantidade mínima de componentes exigida. | Média | RF16, RF17 | `EM DESENVOLVIMENTO` |
| **RF19** | O sistema deve validar a coerência lógica e elétrica das conexões montadas pelo usuário na bancada de ensaios. | Alta | RF18 | `EM DESENVOLVIMENTO` |
| **RF20** | O jogo deve exibir retorno de sucesso com estrelas de desempenho e concessão de +50XP ao concluir o circuito. | Alta | RF19, RF22 | `EM DESENVOLVIMENTO` |
| **RF21** | O jogo deve fornecer dicas pedagógicas e orientações construtivas no modal de erro caso o circuito contenha falhas. | Alta | RF19 | `EM DESENVOLVIMENTO` |
| **RF22** | O sistema deve acumular e persistir o saldo total de XP conquistado pelo aluno ao término de cada desafio. | Alta | RF01 | `EM DESENVOLVIMENTO` |
| **RF23** | O usuário deve conseguir visualizar a classificação geral (ranking) e seu posicionamento frente aos colegas. | Média | RF22 | `EM DESENVOLVIMENTO` |
| **RF24** | O professor deve ter acesso a um relatório com o progresso, tempo e erros dos alunos nas atividades. | Média | RF08, RF20, RF22 | `EM DESENVOLVIMENTO` |
| **RF25** | O aluno deve poder realizar login utilizando identificador único simples (ex.: apelido/matrícula + PIN de 4 dígitos ou avatar). | Alta | RF01 | `EM DESENVOLVIMENTO` |
| **RF26** | O professor deve conseguir criar turmas, gerar código de vinculação e associar alunos à sua respectiva turma. | Alta | RF01 | `EM DESENVOLVIMENTO` |
| **RF27** | O sistema deve permitir ao professor/administrador cadastrar novos componentes, imagens, descrições e objetivos de circuito. | Média | Nenhum | `EM DESENVOLVIMENTO` |
| **RF28** | O usuário deve conseguir selecionar e filtrar os desafios e quizzes por nível (Iniciante / Intermediário). | Alta | Nenhum | `EM DESENVOLVIMENTO` |
| **RF29** | O aluno deve conseguir visualizar seu histórico de tentativas, circuitos concluídos e medalhas/estrelas conquistadas no perfil. | Média | RF22, RF25 | `EM DESENVOLVIMENTO` |

---

## Como Executar o Projeto Localmente

---

## Licença

Este projeto é desenvolvido para fins acadêmicos e educacionais sob a licença GPL-3.0. Consulte o arquivo `LICENSE` para mais detalhes.
