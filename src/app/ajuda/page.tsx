import Link from "next/link";
import { BadgeHelp, Dices, Play, Route } from "lucide-react";
import { Header } from "@/components/header";

export default function AjudaPage() {
  return (
    <div className="relative min-h-screen bg-[#212121] text-white font-sans flex flex-col justify-between">
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#cccccc 1.5px, transparent 1.5px)`,
          backgroundSize: `24px 24px`
        }}
      />

      <Header />

      <main className="relative z-10 flex-1 max-w-[1216px] w-full mx-auto px-6 py-16 flex flex-col gap-16">
        <section className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 max-w-4xl">
            <h1 className="text-4xl md:text-[48px] font-bold text-[#f6f6f9] tracking-tight leading-tight">
              Guia de Como Jogar
            </h1>
            <div className="text-lg text-white leading-relaxed flex flex-col gap-3 max-w-3xl">
              <p>
                Bem-vindo ao LabApp! Este é o seu laboratório virtual para se tornar um mestre em robótica e eletrônica. Aqui, você vai aprender jogando, errando, consertando e acumulando muito XP para subir no nosso Ranking!
              </p>
              <p>
                Abaixo, veja como funciona cada um dos nossos 3 modos principais de jogo:
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-12 w-full">
            {/* Jogo de Eletrônica */}
            <div className="bg-[#262626] border border-[#5e5e5e] p-8 md:p-[32px] rounded-[8px] flex flex-col gap-6 text-white w-full">
              <div className="flex flex-col gap-8">
                <Route className="w-[96px] h-[96px] text-white stroke-[1.5]" />
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    Jogo de Eletrônica
                  </h2>
                  <div className="flex flex-col gap-3 text-base leading-relaxed">
                    <p>
                      <strong className="font-bold">O Objetivo:</strong> Montar circuitos elétricos que funcionem de verdade.
                    </p>
                    <p>
                      <strong className="font-bold">Como jogar:</strong> Na tela, você verá a sua Biblioteca de Componentes (sua caixa de ferramentas) e a Área de Montagem com alguns Slots (vagas vazias).
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 text-base leading-relaxed mt-2">
                    <p className="font-bold">Passo a passo:</p>
                    <ol className="list-decimal pl-6 flex flex-col gap-2">
                      <li>
                        <span>Escolha o componente certo na biblioteca e clique ou arraste-o até o Slot correto.</span>
                      </li>
                      <li>
                        <span>Depois de preencher os espaços, clique no botão &quot;Verificar Circuito&quot;.</span>
                      </li>
                      <li>
                        <span>Se você acertar: Um modal roxo de Parabéns vai aparecer e você ganha +50XP!</span>
                      </li>
                      <li>
                        <span>Se algo der errado: Não se preocupe! O modal vermelho &quot;Oops! Tem algo errado...&quot; vai te dar uma dica preciosa. Clique em &quot;Tentar novamente&quot;, mude a ordem das peças e teste outra vez!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-[#5e5e5e] my-2" />

              <div>
                <Link
                  href="/"
                  className="bg-white text-black hover:bg-gray-100 px-[32px] py-[16px] rounded-[8px] font-medium text-base inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Jogar agora</span>
                  <Play className="w-5 h-5 fill-black text-black" />
                </Link>
              </div>
            </div>

            {/* Jogo de Perguntas (Quiz) */}
            <div className="bg-[#262626] border border-[#5e5e5e] p-8 md:p-[32px] rounded-[8px] flex flex-col gap-6 text-white w-full">
              <div className="flex flex-col gap-8">
                <BadgeHelp className="w-[96px] h-[96px] text-white stroke-[1.5]" />
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    Jogo de Perguntas (Quiz)
                  </h2>
                  <div className="flex flex-col gap-3 text-base leading-relaxed">
                    <p>
                      <strong className="font-bold">O Objetivo:</strong> Testar seus conhecimentos sobre programação de robôs e automação.
                    </p>
                    <p>
                      <strong className="font-bold">Como jogar:</strong> Uma pergunta sobre o mundo do Arduino vai aparecer no topo da tela com algumas alternativas de resposta logo abaixo.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 text-base leading-relaxed mt-2">
                    <p className="font-bold">Passo a passo:</p>
                    <ol className="list-decimal pl-6 flex flex-col gap-2">
                      <li>
                        <span>Leia a pergunta com atenção e clique na alternativa que você acha que é a correta.</span>
                      </li>
                      <li>
                        <span>Olhe para a barra de progresso no topo para saber quantas perguntas ainda faltam.</span>
                      </li>
                      <li>
                        <span>No final, o sistema mostra o seu resultado: acertando as perguntas, você ganha as estrelas douradas de conquista e +30XP para a sua conta!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-[#5e5e5e] my-2" />

              <div>
                <Link
                  href="/"
                  className="bg-white text-black hover:bg-gray-100 px-[32px] py-[16px] rounded-[8px] font-medium text-base inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Jogar agora</span>
                  <Play className="w-5 h-5 fill-black text-black" />
                </Link>
              </div>
            </div>

            {/* Jogo de Memorização */}
            <div className="bg-[#262626] border border-[#5e5e5e] p-8 md:p-[32px] rounded-[8px] flex flex-col gap-6 text-white w-full">
              <div className="flex flex-col gap-8">
                <Dices className="w-[96px] h-[96px] text-white stroke-[1.5]" />
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    Jogo de Memorização
                  </h2>
                  <div className="flex flex-col gap-3 text-base leading-relaxed">
                    <p>
                      <strong className="font-bold">O Objetivo:</strong> Treinar seus olhos para reconhecer as peças reais de robótica num piscar de olhos.
                    </p>
                    <p>
                      <strong className="font-bold">Como jogar:</strong> Você verá fotos reais de placas, sensores e atuadores usados no mundo real.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 text-base leading-relaxed mt-2">
                    <p className="font-bold">Passo a passo:</p>
                    <ol className="list-decimal pl-6 flex flex-col gap-2">
                      <li>
                        <span>Olhe para a foto do componente que aparece na tela.</span>
                      </li>
                      <li>
                        <span>Associe a imagem ao nome correto dele nas opções ou encontre o seu par correspondente.</span>
                      </li>
                      <li>
                        <span>Quanto mais rápido você reconhecer e associar, mais você exercita sua memória para os laboratórios físicos da escola!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-[#5e5e5e] my-2" />

              <div>
                <Link
                  href="/"
                  className="bg-white text-black hover:bg-gray-100 px-[32px] py-[16px] rounded-[8px] font-medium text-base inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Jogar agora</span>
                  <Play className="w-5 h-5 fill-black text-black" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 max-w-4xl">
            <h2 className="text-4xl md:text-[48px] font-bold text-[#f6f6f9] tracking-tight leading-tight">
              Glossário de Termos
            </h2>
            <p className="text-lg text-white leading-relaxed">
              Ficou confuso com alguma palavra difícil dentro do app? O nosso glossário descomplica para você:
            </p>
          </div>

          <div className="bg-[#262626] border border-[#5e5e5e] p-8 md:p-[32px] rounded-[8px] text-white w-full">
            <div className="flex flex-col gap-4 text-base leading-relaxed">
              <p>
                <strong className="font-bold">Arduino:</strong> É o &quot;cérebro&quot; do seu projeto de robótica. É uma placa azul pequenininha onde a gente conecta todas as outras peças e escreve os comandos no computador para fazer o robô ganhar vida.
              </p>
              <p>
                <strong className="font-bold">Atuador:</strong> É qualquer componente que faz o robô realizar uma ação física que você consegue ver ou ouvir. Exemplos: um motor que faz as rodas girarem, ou um Buzzer que emite um bipe sonoro.
              </p>
              <p>
                <strong className="font-bold">Biblioteca de Componentes:</strong> É o seu estoque digital de peças. Fica na lateral do Jogo de Eletrônica e guarda todas as peças que você precisa para montar seus desafios.
              </p>
              <p>
                <strong className="font-bold">Circuito Elétrico:</strong> É o &quot;caminho&quot; fechado por onde a eletricidade viaja. Para um LED acender, a energia precisa sair da bateria, passar pelo fio, pelo LED e voltar, completando o caminho sem nenhuma interrupção.
              </p>
              <p>
                <strong className="font-bold">Hardware:</strong> É toda parte física do robô ou do computador. Ou seja, tudo aquilo que você consegue tocar com as mãos (placas, cabos, botões, motores).
              </p>
              <p>
                <strong className="font-bold">LDR (Sensor de Luz):</strong> É um sensor que funciona como os &quot;olhos&quot; do robô. Ele consegue perceber se o ambiente está muito claro ou muito escuro. Sabe as luzes dos postes da rua que acendem sozinhas quando escurece? Elas usam um LDR!
              </p>
              <p>
                <strong className="font-bold">Sensor:</strong> É o componente que ajuda o robô a perceber o que está acontecendo ao redor dele (como sentir calor, distância, luz ou som). Eles funcionam exatamente como os nossos sentidos (olhos, ouvidos, tato).
              </p>
              <p>
                <strong className="font-bold">Slot:</strong> Significa &quot;vaga&quot; ou &quot;espaço reservado&quot;. No Jogo de Eletrônica, são os quadradinhos cinzas vazios onde os componentes se encaixam perfeitamente.
              </p>
              <p>
                <strong className="font-bold">XP (Pontos de Experiência):</strong> São os pontos que você ganha toda vez que conclui um Quiz ou uma Montagem. Quanto mais XP você acumular, mais alto você sobe no Ranking do LabApp para mostrar a todos que você é fera em robótica!
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#333]">
        <div className="max-w-7xl w-full mx-auto px-6 py-6 text-center text-sm text-white">
          <p>LabApp — Projeto LabiNEC (UFC / SMD)</p>
        </div>
      </footer>
    </div>
  );
}
