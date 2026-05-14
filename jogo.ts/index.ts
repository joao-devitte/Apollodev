import { Cavaleiro } from "./cavaleiro.js";
import { Petista } from "./Petista.js";
import { Jogo } from "./jogo1.js";

// ====== CONFIGURAÇÃO DO CONSOLE ======
// Guarda as funções originais do console
const originalLog = console.log.bind(console);
const originalError = console.error.bind(console);

/**
 * Adiciona um novo log ao elemento de saída no HTML
 */
function adicionarLogNaTela(output: HTMLPreElement | null, ...args: unknown[]): void {
  const texto = args
    .map((item) => (typeof item === "object" ? JSON.stringify(item, null, 2) : String(item)))
    .join(" ");

  if (output) {
    output.textContent += texto + "\n";
    output.scrollTop = output.scrollHeight;
  }
}

// Sobrescreve console.log para enviar para a tela também
console.log = (...args: unknown[]): void => {
  const output = document.getElementById("output") as HTMLPreElement | null;
  adicionarLogNaTela(output, ...args);
  originalLog(...args);
};

// Sobrescreve console.error para enviar para a tela também
console.error = (...args: unknown[]): void => {
  const output = document.getElementById("output") as HTMLPreElement | null;
  adicionarLogNaTela(output, "[ERRO]", ...args);
  originalError(...args);
};

// ====== GERENCIAMENTO DA UI ======

/**
 * Interface que agrupa todos os elementos de um personagem na UI
 */
interface ElementosPersonagem {
  hp: HTMLElement | null;
  barraSaude: HTMLElement | null;
  status: HTMLElement | null;
  card: HTMLElement | null;
}

/**
 * Atualiza a barra de vida e informações de um personagem
 */
function atualizarBarraSaude(
  personagem: any,
  elementos: ElementosPersonagem,
  vidaMaxima: number
): void {
  if (!elementos.hp || !elementos.barraSaude || !elementos.status) {
    return;
  }

  const vida = Math.max(0, Math.round(personagem.vida));
  const percentualVida = (vida / vidaMaxima) * 100;

  elementos.hp.textContent = `HP: ${vida} / ${vidaMaxima}`;
  elementos.barraSaude.style.width = `${Math.max(0, Math.min(100, percentualVida))}%`;
  elementos.status.textContent = personagem.ultimoEvento || "Sem ação recente";
}

/**
 * Anima um ataque no card do personagem
 */
function animarAtaque(elemento: HTMLElement | null): void {
  if (!elemento) return;

  elemento.classList.remove("hit");
  // Força o navegador a reprocessar o CSS
  void elemento.offsetWidth;
  elemento.classList.add("hit");
}

// ====== LÓGICA DA BATALHA ======

/**
 * Configuração inicial dos personagens e callbacks
 */
function configurarPersonagens(
  welinton: Cavaleiro,
  petista: Petista,
  elementosWelinton: ElementosPersonagem,
  elementosPetista: ElementosPersonagem
): void {
  // Welinton
  welinton.setAnimacaoAtaque(() => animarAtaque(elementosWelinton.card));
  welinton.setAtualizadorStatus(() => atualizarBarraSaude(welinton, elementosWelinton, 500));
  welinton.setRegeneracao(12);

  // Petista
  petista.setAnimacaoAtaque(() => animarAtaque(elementosPetista.card));
  petista.setAtualizadorStatus(() => atualizarBarraSaude(petista, elementosPetista, 300));
  petista.setRegeneracao(8);
}

/**
 * Executa os exemplos de ataques especiais antes da batalha
 */
function executarExemplosDeAtaques(welinton: Cavaleiro, petista: Petista): void {
  console.log("\n=== Exemplos de Ataques Diferentes ===");
  welinton.atacarComTipo(petista, "Espada");
  welinton.atacarComTipo(petista, "Mãos");
  welinton.atacarComTipo(petista, "Duas Espadas");
}

/**
 * Interface para rastrear o estado da batalha
 */
interface EstadoBatalha {
  turno: number;
  maxTurnos: number;
  completa: boolean;
}

/**
 * Executa a batalha de forma assíncrona
 * Usa requestAnimationFrame para não bloquear a UI
 */
function executarBatalhaAssincrona(welinton: Cavaleiro, petista: Petista): void {
  const estado: EstadoBatalha = {
    turno: 1,
    maxTurnos: 100,
    completa: false,
  };

  function executarTurno() {
    // Verifica condição de término
    if (estado.completa || estado.turno > estado.maxTurnos) {
      finalizarBatalha(estado, welinton, petista);
      return;
    }

    // Executa turno
    console.log(`\n${'='.repeat(30)} TURNO ${estado.turno} ${'='.repeat(30)}`);
    welinton.atacar(petista);

    // Verifica se inimigo morreu
    if (!petista.estaVivo()) {
      estado.completa = true;
      finalizarBatalha(estado, welinton, petista);
      return;
    }

    // Turno do inimigo
    petista.atacar(welinton);

    // Regeneração
    welinton.regenerar();
    petista.regenerar();

    estado.turno++;

    // Continua a batalha no próximo frame
    requestAnimationFrame(executarTurno);
  }

  requestAnimationFrame(executarTurno);
}

/**
 * Finaliza a batalha e anuncia o vencedor
 */
function finalizarBatalha(
  estado: EstadoBatalha,
  welinton: Cavaleiro,
  petista: Petista
): void {
  if (estado.turno > estado.maxTurnos) {
    console.log("⏱️ Limite de turnos atingido!");
  }

  const vencedor = welinton.estaVivo() ? welinton : petista;
  console.log(`\n🏆 ${vencedor.nome} ganhou a luta!");
  console.log("Batalha concluída!");
}

// ====== INICIALIZAÇÃO ======

/**
 * Inicia a batalha
 */
function iniciarBatalha(
  output: HTMLPreElement | null,
  elementosWelinton: ElementosPersonagem,
  elementosPetista: ElementosPersonagem
): void {
  console.log("🎮 Iniciando batalha...");

  if (!output) {
    console.error("Elemento output não encontrado!");
    return;
  }

  // Limpa o console anterior
  output.textContent = "";

  try {
    // Cria os personagens
    console.log("👥 Criando personagens...");
    const welinton = new Cavaleiro("Welinton Cavaleiro", 50, 500);
    const petista = new Petista("Goblin Petista", 15, 300);

    // Configura callbacks de UI
    console.log("⚙️ Configurando interface...");
    configurarPersonagens(welinton, petista, elementosWelinton, elementosPetista);

    // Executa exemplos de ataques
    executarExemplosDeAtaques(welinton, petista);

    // Inicia a batalha
    console.log("\n⚔️ === Iniciando batalha ===");
    executarBatalhaAssincrona(welinton, petista);
  } catch (erro) {
    console.error("Erro ao iniciar batalha:", erro);
  }
}

// ====== EVENT LISTENERS ======

/**
 * Inicialização quando a página carrega
 */
window.addEventListener("load", () => {
  console.log("📄 Página carregada!");

  // Obtém todos os elementos da página
  const output = document.getElementById("output") as HTMLPreElement | null;
  const runButton = document.getElementById("run") as HTMLButtonElement | null;

  const elementosWelinton: ElementosPersonagem = {
    hp: document.getElementById("hp-welinton"),
    barraSaude: document.getElementById("health-fill-welinton"),
    status: document.getElementById("status-welinton"),
    card: document.getElementById("card-welinton"),
  };

  const elementosPetista: ElementosPersonagem = {
    hp: document.getElementById("hp-petista"),
    barraSaude: document.getElementById("health-fill-petista"),
    status: document.getElementById("status-petista"),
    card: document.getElementById("card-petista"),
  };

  // Verifica se botão foi encontrado
  if (!runButton) {
    console.error("❌ Botão 'run' não encontrado!");
    return;
  }

  // Adiciona evento ao botão
  runButton.addEventListener("click", () => {
    console.log("🎮 Botão clicado! Iniciando batalha...");
    iniciarBatalha(output, elementosWelinton, elementosPetista);
  });

  console.log("✅ Jogo pronto! Clique no botão para começar.");
});
