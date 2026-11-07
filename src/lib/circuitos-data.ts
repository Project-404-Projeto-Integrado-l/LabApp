export interface CircuitSlot {
  id: string;
  x: number; // Porcentagem horizontal (0 a 100%)
  y: number; // Porcentagem vertical (0 a 100%)
  width?: number; // Porcentagem horizontal do slot (ex: 12)
  height?: number; // Porcentagem vertical do slot (ex: 12)
  targetComponentId: string; // ID do componente esperado (ex: 'resistor')
  name: string; // Ex: 'Slot 1'
  description: string; // Descrição conceitual do componente / função no circuito
  hint?: string; // Descrição ou dica conceitual
}

export type CircuitDifficulty = "iniciante" | "intermediario" | "avancado";

export interface CircuitChallenge {
  id: string;
  title: string;
  practicalObjective: string;
  description: string;
  difficulty: CircuitDifficulty;
  image_url: string;
  slots: CircuitSlot[];
  allowedComponents: string[];
  explanation: string;
  pedagogicalTips: string[];
  xpReward: number;
  created_at?: string;
}

export interface VirtualComponent {
  id: string;
  name: string;
  category: "Placas" | "Fontes" | "Passivos" | "Atuadores" | "Sensores";
  image_url: string;
  description: string;
  filter?: string;
}

export const AVAILABLE_COMPONENTS: VirtualComponent[] = [
  {
    id: "arduino",
    name: "Arduino Uno R3",
    category: "Placas",
    image_url: "/components/arduino.png",
    description: "Placa microcontroladora de código aberto baseada no ATmega328P. O cérebro do circuito."
  },
  {
    id: "resistor",
    name: "Resistor (220Ω / 10kΩ)",
    category: "Passivos",
    image_url: "/components/resistor.png",
    description: "Componente que oferece oposição à corrente elétrica, protegendo semicondutores e dividindo tensões."
  },
  {
    id: "led-vermelho",
    name: "LED Vermelho",
    category: "Atuadores",
    image_url: "/components/led-vermelho.png",
    description: "Diodo Emissor de Luz vermelho. Emite luz quando polarizado diretamente."
  },
  {
    id: "led-verde",
    name: "LED Verde",
    category: "Atuadores",
    image_url: "/components/led-verde.svg",
    description: "Diodo Emissor de Luz verde. Usado como sinalizador visual em circuitos."
  },
  {
    id: "bateria-9v",
    name: "Bateria 9V",
    category: "Fontes",
    image_url: "/components/bateria-9v.png",
    description: "Fonte de energia portátil de corrente contínua (DC) com 9 Volts de tensão nominal."
  },
  {
    id: "botao",
    name: "Botão Push-Button",
    category: "Sensores",
    image_url: "/components/botao.png",
    description: "Chave táctil normalmente aberta. Fecha o contato elétrico enquanto mantido pressionado."
  },
  {
    id: "sensor-ldr",
    name: "Sensor LDR (Fotoresistor)",
    category: "Sensores",
    image_url: "/components/sensor-ldr.svg",
    description: "Resistor cuja resistência varia de acordo com a intensidade da luz ambiente incidente."
  },
  {
    id: "capacitor",
    name: "Capacitor Eletrolítico",
    category: "Passivos",
    image_url: "/components/capacitor.png",
    description: "Componente capaz de armazenar e descarregar cargas elétricas em circuitos de filtragem."
  },
  {
    id: "motor-dc",
    name: "Motor DC com Redução",
    category: "Atuadores",
    image_url: "/components/motor-dc.svg",
    description: "Atuador eletromecânico que converte energia elétrica em energia mecânica rotacional."
  }
];

export const DEFAULT_CIRCUITS: CircuitChallenge[] = [
  {
    id: "circuito-01",
    title: "Circuito Básico de LED com Bateria 9V",
    practicalObjective: "Alimentar um LED verde através de uma bateria de 9V, protegendo-o com um resistor limitador para evitar sobrecarga térmica.",
    description: "Neste primeiro desafio, você aprenderá como energizar um componente emissor de luz usando uma fonte contínua de 9V e a importância do resistor de proteção.",
    difficulty: "iniciante",
    image_url: "/circuitos/circuito01.png",
    xpReward: 50,
    allowedComponents: ["bateria-9v", "led-verde", "resistor", "arduino", "capacitor"],
    explanation: "A corrente elétrica flui do polo positivo (+) da bateria de 9V até o resistor de proteção, atravessa o LED verde e retorna ao polo negativo (-), fechando o circuito em segurança.",
    pedagogicalTips: [
      "Lembre-se: conectar um LED diretamente a 9V sem resistor causará queima imediata por excesso de corrente.",
      "A Bateria de 9V deve ser encaixada no conector de alimentação da extremidade direita.",
      "O Resistor atua como guardião, reduzindo a corrente antes que chegue ao LED verde."
    ],
    slots: [
      {
        id: "slot-01-bat",
        name: "Slot 1 - Alimentação",
        description: "Fonte de energia portátil de corrente contínua (DC) com 9 Volts que fornece a diferença de potencial para o circuito.",
        hint: "Fonte de energia portátil de corrente contínua (DC) com 9 Volts que fornece a diferença de potencial para o circuito.",
        targetComponentId: "bateria-9v",
        x: 88,
        y: 65,
        width: 14,
        height: 18
      },
      {
        id: "slot-01-led",
        name: "Slot 2 - Emissor de Luz",
        description: "Componente semicondutor de sinalização óptica verde que emite fótons quando percorrido por corrente no sentido direto.",
        hint: "Componente semicondutor de sinalização óptica verde que emite fótons quando percorrido por corrente no sentido direto.",
        targetComponentId: "led-verde",
        x: 15,
        y: 35,
        width: 11,
        height: 14
      },
      {
        id: "slot-01-res",
        name: "Slot 3 - Limitador de Corrente",
        description: "Componente passivo ôhmico responsável por limitar a intensidade de corrente elétrica e evitar sobrecarga e queima.",
        hint: "Componente passivo ôhmico responsável por limitar a intensidade de corrente elétrica e evitar sobrecarga e queima.",
        targetComponentId: "resistor",
        x: 20.5,
        y: 42,
        width: 11,
        height: 12
      }
    ]
  },
  {
    id: "circuito-02",
    title: "Controle de LED por Botão e Arduino",
    practicalObjective: "Montar um circuito de chaveamento digital onde o clique em um botão push-button é lido pelo Arduino para acionar um LED indicador.",
    description: "Exercite o uso de entradas digitais no microcontrolador Arduino Uno, integrando um botão táctil e um LED com proteção elétrica.",
    difficulty: "intermediario",
    image_url: "/circuitos/circuito02.png",
    xpReward: 50,
    allowedComponents: ["arduino", "botao", "led-vermelho", "resistor", "capacitor", "motor-dc"],
    explanation: "O botão funciona como uma entrada digital. Ao ser pressionado, altera o nível lógico lido pelo pino digital do Arduino, que em resposta comanda o acendimento do LED vermelho.",
    pedagogicalTips: [
      "O Arduino Uno atua como o cérebro processador do circuito, lendo a chave e acionando o LED.",
      "O resistor na linha do botão funciona como resistor pull-down para evitar leituras flutuantes no pino digital.",
      "O LED vermelho requer resistor de proteção em série conectado ao pino digital de saída."
    ],
    slots: [
      {
        id: "slot-02-ard",
        name: "Slot 1 - Unidade de Processamento",
        description: "Placa microcontroladora programável dotada de pinos de entrada e saída digitais que executa o código de controle.",
        hint: "Placa microcontroladora programável dotada de pinos de entrada e saída digitais que executa o código de controle.",
        targetComponentId: "arduino",
        x: 28,
        y: 55,
        width: 17,
        height: 22
      },
      {
        id: "slot-02-led",
        name: "Slot 2 - Indicador Óptico",
        description: "Diodo semicondutor vermelho que acende para indicar visualmente a ativação do sinal digital comandado.",
        hint: "Diodo semicondutor vermelho que acende para indicar visualmente a ativação do sinal digital comandado.",
        targetComponentId: "led-vermelho",
        x: 54,
        y: 54,
        width: 10,
        height: 13
      },
      {
        id: "slot-02-btn",
        name: "Slot 3 - Chave Táctil",
        description: "Dispositivo de acionamento mecânico normalmente aberto que fecha temporariamente o circuito elétrico sob pressão manual.",
        hint: "Dispositivo de acionamento mecânico normalmente aberto que fecha temporariamente o circuito elétrico sob pressão manual.",
        targetComponentId: "botao",
        x: 59.5,
        y: 70,
        width: 10,
        height: 13
      },
      {
        id: "slot-02-res",
        name: "Slot 4 - Resistor de Pull-Down",
        description: "Componente passivo de referência utilizado para drenar ruídos e garantir nível lógico estável (0V) quando a chave está aberta.",
        hint: "Componente passivo de referência utilizado para drenar ruídos e garantir nível lógico estável (0V) quando a chave está aberta.",
        targetComponentId: "resistor",
        x: 61,
        y: 77.5,
        width: 10,
        height: 12
      }
    ]
  },
  {
    id: "circuito-03",
    title: "Semáforo Duplo com Arduino Uno",
    practicalObjective: "Criar um sistema de sinalização visual com LEDs verde e vermelho controlados independentemente por pinos digitais do Arduino.",
    description: "Aprenda a controlar múltiplos atuadores simultaneamente na mesma protoboard, dimensionando a proteção individual para cada linha de sinal.",
    difficulty: "intermediario",
    image_url: "/circuitos/circuito03.png",
    xpReward: 50,
    allowedComponents: ["arduino", "led-verde", "led-vermelho", "resistor", "botao", "bateria-9v"],
    explanation: "Cada LED está conectado a uma porta digital distinta do Arduino (pinos 11 e 12). Cada um possui seu próprio resistor limitador para manter a corrente segura.",
    pedagogicalTips: [
      "Cada LED necessita de um resistor exclusivo em série; compartilhar um único resistor pode provocar variação indesejada de brilho.",
      "O LED verde deve ser conectado na trilha correspondente ao pino 12.",
      "O LED vermelho deve ser conectado na trilha correspondente ao pino 11."
    ],
    slots: [
      {
        id: "slot-03-ard",
        name: "Slot 1 - Microcontrolador",
        description: "Placa microcontroladora central com portas digitais programáveis independentes para orquestrar a sequência de sinais.",
        hint: "Placa microcontroladora central com portas digitais programáveis independentes para orquestrar a sequência de sinais.",
        targetComponentId: "arduino",
        x: 25,
        y: 65,
        width: 17,
        height: 22
      },
      {
        id: "slot-03-ledg",
        name: "Slot 2 - Sinalizador Verde",
        description: "Emissor de luz visível verde utilizado para indicar condição permitida ou estado inicial no semáforo.",
        hint: "Emissor de luz visível verde utilizado para indicar condição permitida ou estado inicial no semáforo.",
        targetComponentId: "led-verde",
        x: 54.5,
        y: 46.5,
        width: 10,
        height: 13
      },
      {
        id: "slot-03-ledr",
        name: "Slot 3 - Sinalizador Vermelho",
        description: "Emissor de luz visível vermelho utilizado para indicar condição de parada ou alerta na sinalização.",
        hint: "Emissor de luz visível vermelho utilizado para indicar condição de parada ou alerta na sinalização.",
        targetComponentId: "led-vermelho",
        x: 60.5,
        y: 46.5,
        width: 10,
        height: 13
      },
      {
        id: "slot-03-res1",
        name: "Slot 4 - Resistor de Carga 1",
        description: "Componente passivo para limitar a corrente no ramo do primeiro emissor luminoso.",
        hint: "Componente passivo para limitar a corrente no ramo do primeiro emissor luminoso.",
        targetComponentId: "resistor",
        x: 55,
        y: 61.5,
        width: 10,
        height: 12
      },
      {
        id: "slot-03-res2",
        name: "Slot 5 - Resistor de Carga 2",
        description: "Componente passivo para limitar a corrente no ramo do segundo emissor luminoso.",
        hint: "Componente passivo para limitar a corrente no ramo do segundo emissor luminoso.",
        targetComponentId: "resistor",
        x: 61,
        y: 61.5,
        width: 10,
        height: 12
      }
    ]
  },
  {
    id: "circuito-04",
    title: "Sensor de Luz (LDR) com LED de Alerta",
    practicalObjective: "Integrar um sensor óptico LDR a uma porta analógica (A0) do Arduino para detectar luminosidade e disparar um LED de aviso.",
    description: "Explore o conceito de leitura analógica em circuitos robóticos, convertendo variações de luz ambiente em sinais elétricos mensuráveis.",
    difficulty: "avancado",
    image_url: "/circuitos/circuito04.png",
    xpReward: 50,
    allowedComponents: ["arduino", "sensor-ldr", "led-vermelho", "resistor", "botao", "capacitor"],
    explanation: "O LDR forma um divisor de tensão com um resistor de 10kΩ. A tensão resultante no nó intermediário é lida pela porta analógica A0. Conforme a luminosidade cai, o Arduino acende o LED.",
    pedagogicalTips: [
      "O LDR varia sua resistência elétrica conforme a luz que atinge sua superfície.",
      "O divisor de tensão composto pelo LDR e pelo resistor permite que o Arduino meça a variação analógica de 0 a 5V.",
      "Não se esqueça do resistor limitador do LED vermelho conectado à saída digital."
    ],
    slots: [
      {
        id: "slot-04-ard",
        name: "Slot 1 - Cérebro Digital",
        description: "Placa microcontroladora com conversor analógico-digital (ADC) para amostragem de dados de sensores.",
        hint: "Placa microcontroladora com conversor analógico-digital (ADC) para amostragem de dados de sensores.",
        targetComponentId: "arduino",
        x: 42,
        y: 54,
        width: 16,
        height: 22
      },
      {
        id: "slot-04-ldr",
        name: "Slot 2 - Sensor Fotossensível",
        description: "Componente cuja resistência interna decresce à medida que a intensidade da luz ambiente incidente aumenta.",
        hint: "Componente cuja resistência interna decresce à medida que a intensidade da luz ambiente incidente aumenta.",
        targetComponentId: "sensor-ldr",
        x: 82.5,
        y: 33.5,
        width: 10,
        height: 13
      },
      {
        id: "slot-04-led",
        name: "Slot 3 - Atuador de Alerta",
        description: "Semicondutor óptico vermelho acionado quando o valor lido pelo transdutor luminoso atingir o limiar programado.",
        hint: "Semicondutor óptico vermelho acionado quando o valor lido pelo transdutor luminoso atingir o limiar programado.",
        targetComponentId: "led-vermelho",
        x: 67.5,
        y: 33.5,
        width: 10,
        height: 13
      },
      {
        id: "slot-04-res1",
        name: "Slot 4 - Resistor de Proteção",
        description: "Elemento de resistência ôhmica em série destinado a manter a corrente do atuador luminoso dentro da faixa segura.",
        hint: "Elemento de resistência ôhmica em série destinado a manter a corrente do atuador luminoso dentro da faixa segura.",
        targetComponentId: "resistor",
        x: 67,
        y: 45,
        width: 10,
        height: 12
      },
      {
        id: "slot-04-res2",
        name: "Slot 5 - Resistor de Divisão",
        description: "Componente resistor de valor fixo (10kΩ) que forma com o sensor um divisor de potencial elétrico para a leitura analógica.",
        hint: "Componente resistor de valor fixo (10kΩ) que forma com o sensor um divisor de potencial elétrico para a leitura analógica.",
        targetComponentId: "resistor",
        x: 82.5,
        y: 45,
        width: 10,
        height: 12
      }
    ]
  },
  {
    id: "circuito-05",
    title: "Controle de Motor DC com Arduino",
    practicalObjective: "Acionar um motor de corrente contínua com caixa de redução usando saídas PWM do Arduino para controle mecânico rotativo.",
    description: "Compreenda como controlar atuadores de potência que geram movimento físico na robótica móvel e mecanismos automatizados.",
    difficulty: "avancado",
    image_url: "/circuitos/circuito05.png",
    xpReward: 50,
    allowedComponents: ["arduino", "motor-dc", "bateria-9v", "botao", "resistor"],
    explanation: "O motor DC com redução converte sinais modulados por largura de pulso (PWM) em torque e rotação mecânica para movimentação.",
    pedagogicalTips: [
      "Motores DC são atuadores eletromecânicos fundamentais na tração de robôs e carrinhos seguidores de linha.",
      "O Arduino envia sinais de modulação PWM para controlar a velocidade de rotação do motor.",
      "Assegure que tanto a placa de controle quanto o motor estejam corretamente posicionados nos seus respectivos suportes."
    ],
    slots: [
      {
        id: "slot-05-ard",
        name: "Slot 1 - Módulo Controlador",
        description: "Placa microcontroladora que gera pulsos modulados em largura (PWM) para regular a potência entregue à carga mecânica.",
        hint: "Placa microcontroladora que gera pulsos modulados em largura (PWM) para regular a potência entregue à carga mecânica.",
        targetComponentId: "arduino",
        x: 65,
        y: 68,
        width: 18,
        height: 24
      },
      {
        id: "slot-05-mot",
        name: "Slot 2 - Atuador Eletromecânico",
        description: "Dispositivo que converte energia elétrica em força cinética rotacional através de engrenagens redutoras de velocidade.",
        hint: "Dispositivo que converte energia elétrica em força cinética rotacional através de engrenagens redutoras de velocidade.",
        targetComponentId: "motor-dc",
        x: 59,
        y: 21,
        width: 20,
        height: 22
      }
    ]
  }
];

const LOCAL_STORAGE_CIRCUITS_KEY = "labapp_circuitos_data_v2";

export function getStoredCircuits(): CircuitChallenge[] {
  if (typeof window === "undefined") {
    return DEFAULT_CIRCUITS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CIRCUITS_KEY);
    if (!raw) return DEFAULT_CIRCUITS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error("Falha ao ler circuitos salvos no localStorage:", e);
  }
  return DEFAULT_CIRCUITS;
}

export function saveStoredCircuits(circuits: CircuitChallenge[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CIRCUITS_KEY, JSON.stringify(circuits));
  } catch (e) {
    console.error("Falha ao salvar circuitos no localStorage:", e);
  }
}

export function resetStoredCircuits(): CircuitChallenge[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_CIRCUITS_KEY);
  }
  return DEFAULT_CIRCUITS;
}
