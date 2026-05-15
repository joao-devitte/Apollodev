// =============================================================================
//  ARQUIVO PRINCIPAL — main.ts
//
//  Este arquivo é o ponto de entrada do jogo. Ele conecta a lógica de batalha
//  (classes Cavaleiro e Petista) com a interface visual do HTML.
//
//  FLUXO GERAL:
//    1. Página carrega     →  captura elementos do HTML (barras, cards, botão)
//    2. Usuário clica      →  cria os personagens e inicia a batalha
//    3. A batalha roda     →  turno a turno, com delay entre cada ação
//    4. Alguém morre       →  anuncia o vencedor e encerra
//
//  SEÇÕES DESTE ARQUIVO (use Ctrl+F para navegar):
//    § CONSOLE         – redireciona console.log para aparecer no HTML
//    § INTERFACE UI    – funções que atualizam barras de vida e animações
//    § BATALHA         – lógica de turno, delays e encerramento
//    § INICIALIZAÇÃO   – cria personagens e dispara tudo
//    § EVENT LISTENERS – conecta o botão HTML ao código
// =============================================================================

import { Cavaleiro } from "./cavaleiro.js";
import { Petista } from "./Petista.js";
import { jogo } from "./jogo1.js";


// =============================================================================
// § CONSOLE
//
//  Por padrão, console.log só aparece no DevTools do navegador (F12).
//  Aqui sobrescrevemos console.log e console.error para que as mensagens
//  também apareçam dentro do elemento <pre id="output"> no HTML,
//  permitindo ver os logs diretamente na tela do jogo.
// =============================================================================

// Guarda as funções originais antes de sobrescrever, para não perder o DevTools
const logOriginal   = console.log.bind(console);
const erroOriginal  = console.error.bind(console);

/**
 * Escreve uma linha de texto no elemento <pre id="output"> do HTML.
 * Aceita qualquer tipo: objetos viram JSON legível, o resto vira string.
 */
function escreverNoOutput(output: HTMLPreElement | null, ...args: unknown[]): void {
  const linha = args
    .map((item) => (typeof item === "object" ? JSON.stringify(item, null, 2) : String(item)))
    .join(" ");

  if (output) {
    output.textContent += linha + "\n";
    output.scrollTop = output.scrollHeight; // mantém o scroll sempre no fim
  }
}

// Substitui console.log: escreve no HTML E no DevTools (via logOriginal)
console.log = (...args: unknown[]): void => {
  const output = document.getElementById("output") as HTMLPreElement | null;
  escreverNoOutput(output, ...args);
  logOriginal(...args);
};

// Substitui console.error: igual ao log, mas adiciona o prefixo "[ERRO]"
console.error = (...args: unknown[]): void => {
  const output = document.getElementById("output") as HTMLPreElement | null;
  escreverNoOutput(output, "[ERRO]", ...args);
  erroOriginal(...args);
};


// =============================================================================
// § INTERFACE UI
//
//  Funções que lêem o estado dos personagens e atualizam o HTML:
//  texto de HP, largura da barra de saúde e animação de "levou hit".
// =============================================================================

/**
 * Agrupa as referências aos elementos HTML de um personagem.
 * Cada personagem tem: texto de HP, barra de saúde, status e card.
 */
interface ElementosPersonagem {
  hp:         HTMLElement | null; // ex: <span id="hp-welinton">
  barraSaude: HTMLElement | null; // ex: <div id="health-fill-welinton">
  status:     HTMLElement | null; // ex: <p id="status-welinton">
  card:       HTMLElement | null; // ex: <div id="card-welinton"> (recebe classe "hit")
}

/**
 * Lê a vida atual do personagem e atualiza o HTML:
 *  - Texto "HP: X / Y"
 *  - Largura da barra de saúde em porcentagem
 *  - Último evento (ex: "atacou com Espada")
 */
function atualizarBarraSaude(
  personagem: any,
  elementos: ElementosPersonagem,
  vidaMaxima: number
): void {
  if (!elementos.hp || !elementos.barraSaude || !elementos.status) return;

  const vidaAtual   = Math.max(0, Math.round(personagem.vida));
  const porcentagem = (vidaAtual / vidaMaxima) * 100;

  elementos.hp.textContent        = `HP: ${vidaAtual} / ${vidaMaxima}`;
  elementos.barraSaude.style.width = `${Math.max(0, Math.min(100, porcentagem))}%`;
  elementos.status.textContent    = personagem.ultimoEvento || "Sem ação recente";
}

/**
 * Dispara a animação CSS de "levou hit" no card do personagem.
 * Remove e readiciona a classe "hit" para reiniciar a animação mesmo
 * que ela já esteja rodando — o "void offsetWidth" força o reflow do navegador.
 */
function animarAtaque(elemento: HTMLElement | null): void {
  if (!elemento) return;
  elemento.classList.remove("hit");
  void elemento.offsetWidth; // faz o navegador reconhecer a remoção antes de adicionar de volta
  elemento.classList.add("hit");
}


// =============================================================================
// § BATALHA
//
//  Toda a lógica de combate fica aqui:
//    - configurarPersonagens    → liga funções de UI aos personagens
//    - demonstrarTiposDeAtaque  → exibe exemplos antes da batalha
//    - esperarMs                → pausa assíncrona entre ações
//    - executarBatalha          → loop principal turno a turno
//    - anunciarVencedor         → exibe o resultado final
// =============================================================================

/**
 * Liga as funções de animação e atualização de UI a cada personagem,
 * e define a quantidade de vida regenerada por turno.
 *
 * Usa callbacks para que as classes (Cavaleiro, Petista) não precisem
 * conhecer o HTML — elas simplesmente chamam a função que receberam.
 */
function configurarPersonagens(
  welinton: Cavaleiro,
  petista:  Petista,
  elementosWelinton: ElementosPersonagem,
  elementosPetista:  ElementosPersonagem
): void {
  welinton.setAnimacaoAtaque(  () => animarAtaque(elementosWelinton.card));
  welinton.setAtualizadorStatus(() => atualizarBarraSaude(welinton, elementosWelinton, welinton.vidaMaxima));
  welinton.setRegeneracao(12); // regenera 12 HP por turno

  petista.setAnimacaoAtaque(  () => animarAtaque(elementosPetista.card));
  petista.setAtualizadorStatus(() => atualizarBarraSaude(petista, elementosPetista, petista.vidaMaxima));
  petista.setRegeneracao(8);  // regenera 8 HP por turno
}

/**
 * Executa três ataques de demonstração antes da batalha principal
 * para mostrar no log os diferentes tipos de ataque disponíveis.
 */
function demonstrarTiposDeAtaque(welinton: Cavaleiro, petista: Petista): void {
  console.log("\n=== Exemplos de Ataques Diferentes ===");
  welinton.atacarComTipo(petista, "Espada");
  welinton.atacarComTipo(petista, "Mãos");
  welinton.atacarComTipo(petista, "Duas Espadas");
}

/**
 * Pausa a execução por X milissegundos.
 * Usada com "await" no loop de batalha para que cada ação
 * apareça na tela antes da próxima acontecer.
 *
 * Exemplo: await esperarMs(800) → espera 0,8 segundo
 */
function esperarMs(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Loop principal da batalha — roda até alguém morrer ou atingir 100 turnos.
 *
 * Sequência de cada turno:
 *   1. Welinton ataca o Petista   → aguarda 800ms (dá tempo de ver na tela)
 *   2. Checa se Petista morreu    → se sim, encerra
 *   3. Petista ataca o Welinton   → aguarda 800ms
 *   4. Checa se Welinton morreu   → se sim, encerra
 *   5. Ambos regeneram vida       → aguarda 400ms
 *   6. Avança para o próximo turno
 */
async function executarBatalha(welinton: Cavaleiro, petista: Petista): Promise<void> {
  const MAX_TURNOS = 100;

  for (let turno = 1; turno <= MAX_TURNOS; turno++) {
    console.log(`\n${"=".repeat(30)} TURNO ${turno} ${"=".repeat(30)}`);

    // --- Ataque de Welinton ---
    welinton.atacar(petista);
    await esperarMs(800);

    if (!petista.estaVivo()) {
      anunciarVencedor(welinton, turno, false);
      return;
    }

    // --- Ataque do Petista ---
    petista.atacar(welinton);
    await esperarMs(800);

    if (!welinton.estaVivo()) {
      anunciarVencedor(petista, turno, false);
      return;
    }

    // --- Regeneração de ambos ---
    welinton.regenerar();
    petista.regenerar();
    await esperarMs(400);
  }

  // Chegou aqui: ninguém morreu em 100 turnos → empate
  anunciarVencedor(null, MAX_TURNOS, true);
}

/**
 * Exibe a mensagem de fim de batalha no log.
 *
 * @param vencedor        - O personagem que ganhou, ou null em caso de empate
 * @param turno           - Turno em que a batalha terminou
 * @param limiteAtingido  - true se a batalha acabou por limite de turnos
 */
function anunciarVencedor(
  vencedor: Cavaleiro | Petista | null,
  turno: number,
  limiteAtingido: boolean
): void {
  if (limiteAtingido) {
    console.log(`⏱️ Limite de ${turno} turnos atingido! Empate!`);
  } else {
    console.log(`\n🏆 ${vencedor!.nome} ganhou a luta no turno ${turno}!`);
  }
  console.log("Batalha concluída!");
}


// =============================================================================
// § INICIALIZAÇÃO
//
//  Chamada quando o usuário clica no botão "Iniciar Batalha".
//  Limpa o log anterior, cria os personagens do zero,
//  configura a UI e dispara a batalha.
// =============================================================================

/**
 * Ponto de entrada da batalha — chamado pelo clique do botão.
 * Recria os personagens a cada clique, reiniciando a partida do zero.
 */
async function iniciarBatalha(
  output: HTMLPreElement | null,
  elementosWelinton: ElementosPersonagem,
  elementosPetista:  ElementosPersonagem
): Promise<void> {
  if (!output) {
    console.error("Elemento output não encontrado!");
    return;
  }

  // Limpa o log da batalha anterior antes de começar
  output.textContent = "";
  console.log("🎮 Iniciando batalha...");

  try {
    // Cria personagens: (nome, ataque base, vida máxima)
    console.log("👥 Criando personagens...");
    const welinton = new Cavaleiro("Welinton Cavaleiro", 50, 500);
    const petista  = new Petista("Goblin Petista",       15, 300);

    // Conecta os personagens à interface visual
    console.log("⚙️ Configurando interface...");
    configurarPersonagens(welinton, petista, elementosWelinton, elementosPetista);

    // Exibe exemplos de ataques no log antes de começar
    demonstrarTiposDeAtaque(welinton, petista);

    // Inicia o loop de batalha e aguarda ele terminar
    console.log("\n⚔️ === Iniciando batalha ===");
    await executarBatalha(welinton, petista);

  } catch (erro) {
    console.error("Erro ao iniciar batalha:", erro);
  }
}


// =============================================================================
// § EVENT LISTENERS
//
//  Aguarda a página carregar completamente, captura todos os elementos
//  do HTML e registra o clique no botão para chamar iniciarBatalha().
// =============================================================================

window.addEventListener("load", () => {
  console.log("📄 Página carregada!");

  // Captura o painel de log e o botão de início
  const output       = document.getElementById("output") as HTMLPreElement   | null;
  const botaoIniciar = document.getElementById("run")    as HTMLButtonElement | null;

  // Captura os elementos visuais do Welinton
  const elementosWelinton: ElementosPersonagem = {
    hp:         document.getElementById("hp-welinton"),
    barraSaude: document.getElementById("health-fill-welinton"),
    status:     document.getElementById("status-welinton"),
    card:       document.getElementById("card-welinton"),
  };

  // Captura os elementos visuais do Petista
  const elementosPetista: ElementosPersonagem = {
    hp:         document.getElementById("hp-petista"),
    barraSaude: document.getElementById("health-fill-petista"),
    status:     document.getElementById("status-petista"),
    card:       document.getElementById("card-petista"),
  };

  if (!botaoIniciar) {
    console.error("❌ Botão 'run' não encontrado no HTML!");
    return;
  }

  // Ao clicar no botão, inicia (ou reinicia) a batalha
  botaoIniciar.addEventListener("click", () => {
    console.log("🎮 Botão clicado! Iniciando batalha...");
    iniciarBatalha(output, elementosWelinton, elementosPetista);
  });

  console.log("✅ Jogo pronto! Clique no botão para começar.");
});