import { cavaleiro as Cavaleiro } from "./cavaleiro.js";
import { petista as Petista } from "./Petista.js";
import { jogo as Jogo } from "./jogo1.js";

const originalLog = console.log.bind(console);
const originalError = console.error.bind(console);

function appendLog(output: HTMLPreElement | null, ...args: unknown[]): void {
  const text = args.map(item => (typeof item === "object" ? JSON.stringify(item, null, 2) : String(item))).join(" ");
  if (output) {
    output.textContent += text + "\n";
    output.scrollTop = output.scrollHeight;
  }
}

console.log = (...args: unknown[]): void => {
  const output = document.getElementById("output") as HTMLPreElement | null;
  appendLog(output, ...args);
  originalLog(...args);
};

console.error = (...args: unknown[]): void => {
  const output = document.getElementById("output") as HTMLPreElement | null;
  appendLog(output, "[ERRO]", ...args);
  originalError(...args);
};

function atualizarSaude(personagem: any, elementoTexto: HTMLElement | null, elementoBarra: HTMLElement | null, elementoEvento: HTMLElement | null, vidaMaxima: number): void {
  if (!elementoTexto || !elementoBarra || !elementoEvento) {
    return;
  }

  const valor = Math.max(0, Math.round(personagem.vida));
  elementoTexto.textContent = `HP: ${valor} / ${vidaMaxima}`;
  elementoBarra.style.width = `${Math.max(0, Math.min(100, (valor / vidaMaxima) * 100))}%`;
  elementoEvento.textContent = personagem.ultimoEvento || "Sem ação recente";
}

function animarAtaque(elemento: HTMLElement | null): void {
  if (!elemento) {
    return;
  }
  elemento.classList.remove("hit");
  void elemento.offsetWidth;
  elemento.classList.add("hit");
}
function startBattle(output: HTMLPreElement | null, healthWelinton: HTMLElement | null, fillWelinton: HTMLElement | null, statusWelinton: HTMLElement | null, cardWelinton: HTMLElement | null, healthPetista: HTMLElement | null, fillPetista: HTMLElement | null, statusPetista: HTMLElement | null, cardPetista: HTMLElement | null): void {
  console.log("Função startBattle chamada!");
  try {
    if (!output) {
      console.error("Output não encontrado!");
      return;
    }

    output.textContent = "";

    console.log("Criando personagens...");''
    const Welinton = new Cavaleiro("Welinton Cavaleiro", 50, 500);
    const PetistaInimigo = new Petista("Goblin Petista", 15, 300);

    console.log("Configurando callbacks..."); // animaçao de ataque
    Welinton.setAnimacaoAtaque(() => animarAtaque(cardWelinton));
    PetistaInimigo.setAtualizadorStatus(() => atualizarSaude(PetistaInimigo, healthPetista, fillPetista, statusPetista, 5);
    await esperartempo();

    PetistaInimigo.setAnimacaoAtaque(() => animarAtaque(cardPetista));

    Welinton.setRegeneracao(12);

    PetistaInimigo.setRegeneracao(8);

    Welinton.setAnimacaoAtaque(() => animarAtaque(cardWelinton));
    PetistaInimigo.setAnimacaoAtaque(() => animarAtaque(cardPetista));


    console.log("Iniciando exemplos de ataques...");
    console.log("\n=== Exemplos de Ataques Diferentes ===\n");
    Welinton.atacarComTipo(PetistaInimigo, "Espada");
    Welinton.atacarComTipo(PetistaInimigo, "Mãos");
    Welinton.atacarComTipo(PetistaInimigo, "Duas Espadas");

    console.log("\n=== Iniciando batalha ===\n");
    const game = new Jogo();
    
    // Executar a batalha de forma assíncrona para não bloquear a UI
    executarBatalhaAssincrona(game, Welinton, PetistaInimigo, output);
    
  } catch (error) {
    console.error("Erro na função startBattle:", error);
  }
}

function executarBatalhaAssincrona(game: any, player1: any, player2: any, output: HTMLPreElement): void {
  let turno = 1;
  const maxTurnos = 100;
  let batalhaCompleta = false;

  function executarTurno() {
    if (batalhaCompleta || turno > maxTurnos) {
      if (turno > maxTurnos) {
        console.log("Limite de turnos atingido!");
      }
      if (player1.isContinuaVivo()) {
        console.log(`${player1.nome} ganhou a luta.`);
      } else {
        console.log(`${player2.nome} ganhou a luta.`);
      }
      console.log("Batalha concluída!");
      return;
    }

    console.log("\n============================ TURNO " + turno + " ============================ ");
    player1.atacar(player2);

    if (!player2.isContinuaVivo()) {
      batalhaCompleta = true;
      if (player1.isContinuaVivo()) {
        console.log(`${player1.nome} ganhou a luta.`);
      } else {
        console.log(`${player2.nome} ganhou a luta.`);
      }
      console.log("Batalha concluída!");
      return;
    }

    player2.atacar(player1);
    player1.regenerar();
    player2.regenerar();

    turno++;
    
    // Agendar próximo turno para a próxima frame
    requestAnimationFrame(executarTurno);
  }

  // Iniciar primeira frame
  requestAnimationFrame(executarTurno);
}

// Inicialização automática quando a página carrega
window.addEventListener("load", function() {
  console.log("Página carregada, inicializando jogo...");

  const output = document.getElementById("output") as HTMLPreElement | null;
  const runButton = document.getElementById("run") as HTMLButtonElement | null;
  const healthWelinton = document.getElementById("hp-welinton");
  const fillWelinton = document.getElementById("health-fill-welinton");
  const statusWelinton = document.getElementById("status-welinton");
  const cardWelinton = document.getElementById("card-welinton");
  const healthPetista = document.getElementById("hp-petista");
  const fillPetista = document.getElementById("health-fill-petista");
  const statusPetista = document.getElementById("status-petista");
  const cardPetista = document.getElementById("card-petista");

  console.log("Elementos encontrados:", {
    output: !!output,
    runButton: !!runButton,
    healthWelinton: !!healthWelinton,
    fillWelinton: !!fillWelinton,
    statusWelinton: !!statusWelinton,
    cardWelinton: !!cardWelinton,
    healthPetista: !!healthPetista,
    fillPetista: !!fillPetista,
    statusPetista: !!statusPetista,
    cardPetista: !!cardPetista
  });

  if (runButton) {
    console.log("Botão encontrado, adicionando event listener...");
    runButton.addEventListener("click", function() {
      console.log("Botão clicado! Iniciando batalha...");
      startBattle(output, healthWelinton, fillWelinton, statusWelinton, cardWelinton, healthPetista, fillPetista, statusPetista, cardPetista);
    });
    console.log("Event listener adicionado com sucesso!");
  } else {
    console.error("ERRO: Botão 'run' não encontrado!");
  }
});