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

## Arquitetura e Stack Tecnológica

A plataforma é construída sobre uma arquitetura moderna, escalável, performática e altamente responsiva.

### Tecnologias Utilizadas

* **Framework Principal:** **[Next.js](https://nextjs.org/) (App Router, React 19 & TypeScript)**
  * Renderização otimizada e arquitetura baseada em Server e Client Components.
* **Estilização & Design System:**
  * **[Tailwind CSS v4](https://tailwindcss.com/):** Estilização moderna e utilitária para layouts responsivos e acessíveis.
  * **[shadcn/ui](https://ui.shadcn.com/) & Base UI:** Componentes de interface acessíveis e customizáveis.
  * **[Lucide React](https://lucide.dev/):** Biblioteca de ícones.
* **Backend, Banco de Dados & Autenticação:**
  * **[Supabase](https://supabase.com/):** Plataforma Backend as a Service (BaaS) responsável por:
    * **Autenticação (Supabase Auth):** Gestão segura de contas e sessões de usuários (Alunos e Professores).
    * **Banco de Dados (PostgreSQL):** Armazenamento de turmas, progresso, quizzes, ranking e pontuações de XP.
* **Hospedagem & Deploy:**
  * **[Vercel](https://vercel.com/):** Infraestrutura de hospedagem serverless com deploy contínuo automatizado.

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
| **RF01** | **Gestão de Perfil**: O usuário (aluno ou professor) deve conseguir cadastrar e gerenciar seu perfil na aplicação, definindo sua categoria. | Alta | Nenhum | `EM DESENVOLVIMENTO` |
| **RF02** | **Navegação Principal**: O usuário (aluno ou professor) deve ser capaz de navegar livremente entre as telas de Início, Catálogo de Jogos, Ranking e Configurações. | Alta | RF01 | `FEITO` |
| **RF03** | **Central de Ajuda**: O usuário (aluno ou professor) deve conseguir acessar a central de suporte contendo instruções de "Como Jogar" e o Glossário de Termos. | Média | RF02 | `FEITO` |
| **RF04** | **Gerenciamento de Conteúdo do Quiz**: O professor/administrador deve conseguir cadastrar, editar, listar e remover perguntas, alternativas e gabaritos para os quizzes. | Alta | Nenhum | `FEITO` |
| **RF05** | **Apresentação de Questões**: O aluno deve visualizar as perguntas do quiz de forma individual com o enunciado e o indicador de progresso (ex.: "Pergunta 01/03"). | Alta | RF04 | `NÃO INICIADO` |
| **RF06** | **Seleção Exclusiva de Resposta**: O aluno deve poder selecionar apenas uma única alternativa por pergunta no quiz. | Alta | RF05 | `NÃO INICIADO` |
| **RF07** | **Feedback Imediato de Resposta**: O aluno deve receber validação automática e retorno visual imediato sobre a correção da resposta escolhida. | Alta | RF06 | `NÃO INICIADO` |
| **RF08** | **Cálculo de Recompensa do Quiz**: O aluno deve receber a pontuação de XP computada ao final do quiz com base no seu desempenho. | Alta | RF07, RF22 | `NÃO INICIADO` |
| **RF09** | **Catálogo de Componentes**: O aluno deve ter acesso a um catálogo com imagens, nomes e descrições dos componentes para o jogo de memorização. | Alta | Nenhum | `EM DESENVOLVIMENTO` |
| **RF10** | **Seleção de Dificuldade de Memorização**: O aluno deve poder alternar livremente entre o "Modo Lúdico" e o "Modo Avançado" no jogo de memorização. | Média | RF09 | `NÃO INICIADO` |
| **RF11** | **Interação com Flashcards**: O aluno deve ser capaz de acionar a ação "Virar Flashcard" para visualizar os detalhes e a imagem do componente. | Alta | RF09 | `NÃO INICIADO` |
| **RF12** | **Associação de Hardware**: O aluno deve associar o componente apresentado em tela à sua opção de identificação correta. | Alta | RF09, RF11 | `NÃO INICIADO` |
| **RF13** | **Prevenção de Submissão Nula**: O aluno deve ser impedido pelo sistema de confirmar respostas em branco, recebendo um aviso contextual. | Média | RF12 | `NÃO INICIADO` |
| **RF14** | **Apresentação de Desafio de Circuito**: O aluno deve visualizar o objetivo prático do circuito elétrico a ser montado na fase atual (ex.: "Ligar um LED com Arduino"). | Alta | Nenhum | `NÃO INICIADO` |
| **RF15** | **Biblioteca de Componentes**: O aluno deve ter à disposição a lista de componentes virtuais disponíveis (Arduino Uno, LED, Resistor, Bateria 9V, Jumper). | Alta | Nenhum | `NÃO INICIADO` |
| **RF16** | **Montagem na Bancada**: O aluno deve poder alocar peças selecionadas da biblioteca nos slots disponíveis na bancada virtual de montagem. | Alta | RF15 | `NÃO INICIADO` |
| **RF17** | **Status Visual dos Slots**: O aluno deve identificar visualmente o estado de cada posição da bancada (ex.: "Slot X Vazio" ou o ícone do componente alocado). | Média | RF16 | `NÃO INICIADO` |
| **RF18** | **Bloqueio de Validação Incompleta**: O aluno deve ter o botão "Validar Circuito" habilitado apenas após preencher a quantidade mínima necessária de componentes. | Média | RF16, RF17 | `NÃO INICIADO` |
| **RF19** | **Simulação e Checagem Eletrônica**: O aluno deve ter a coerência lógica e elétrica das conexões montadas na bancada avaliada pelo sistema. | Alta | RF18 | `NÃO INICIADO` |
| **RF20** | **Recompensa por Conclusão de Circuito**: O aluno deve receber retorno de sucesso com estrelas de desempenho e concessão de +50XP ao concluir o circuito corretamente. | Alta | RF19, RF22 | `NÃO INICIADO` |
| **RF21** | **Dicas de Recuperação Pedagógica**: O aluno deve receber dicas pedagógicas e orientações construtivas no modal de erro caso o circuito contenha falhas. | Alta | RF19 | `NÃO INICIADO` |
| **RF22** | **Persistência de Dados**: O aluno deve ter o saldo total de XP conquistado acumulado e persistido no seu perfil ao término de cada atividade. | Alta | RF01 | `EM DESENVOLVIMENTO` |
| **RF23** | **Visualização de Ranking**: O aluno ou professor deve conseguir visualizar a classificação geral (ranking) e o posicionamento dos estudantes. | Média | RF22 | `FEITO` |
| **RF24** | **Relatório de Acompanhamento**: O professor deve ter acesso a um relatório com métricas de progresso, tempo investido e erros cometidos pelos alunos nas atividades. | Média | RF08, RF20, RF22 | `NÃO INICIADO` |
| **RF25** | **Autenticação Simplificada**: O aluno deve poder realizar login utilizando um identificador único simples (ex.: apelido/matrícula + PIN de 4 dígitos ou seleção de avatar). | Alta | RF01 | `NÃO INICIADO` |
| **RF26** | **Gestão de Turmas**: O professor deve conseguir criar turmas, gerar código de vinculação e associar alunos à sua respectiva sala. | Alta | RF01 | `NÃO INICIADO` |
| **RF27** | **Gerenciamento da Bancada Didática**: O professor/administrador deve poder cadastrar novos componentes, imagens, descrições e metas de circuitos práticos. | Média | Nenhum | `NÃO INICIADO` |
| **RF28** | **Filtragem por Dificuldade**: O aluno ou professor deve conseguir selecionar e filtrar desafios e quizzes por nível pedagógico (Iniciante / Intermediário). | Alta | Nenhum | `NÃO INICIADO` |
| **RF29** | **Histórico e Conquistas**: O aluno deve conseguir visualizar no seu perfil o histórico de tentativas, circuitos finalizados e estrelas obtidas. | Média | RF22, RF25 | `NÃO INICIADO` |

---

## Como Executar o Projeto Localmente

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Configurar as Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto com as credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

3. **Executar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## Licença

Este projeto é desenvolvido para fins acadêmicos e educacionais sob a licença GPL-3.0. Consulte o arquivo `LICENSE` para mais detalhes.
