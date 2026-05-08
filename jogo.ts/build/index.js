import { cavaleiro } from "./cavaleiro.js";
import { petista } from "./Petista.js";
import { jogo } from "./jogo1.js";
const originalLog = console.log.bind(console);
function appendLog(output, ...args) {
    const text = args.map(item => (typeof item === "object" ? JSON.stringify(item, null, 2) : String(item))).join(" ");
    if (output) {
        output.textContent += text + "\n";
        output.scrollTop = output.scrollHeight;
    }
}
console.log = (...args) => {
    const output = document.getElementById("output");
    appendLog(output, ...args);
    originalLog(...args);
};
function atualizarSaude(personagem, elementoTexto, elementoBarra, elementoEvento, vidaMaxima) {
    if (!elementoTexto || !elementoBarra || !elementoEvento) {
        return;
    }
    const valor = Math.max(0, Math.round(personagem.vida));
    elementoTexto.textContent = `HP: ${valor} / ${vidaMaxima}`;
    elementoBarra.style.width = `${Math.max(0, Math.min(100, (valor / vidaMaxima) * 100))}%`;
    elementoEvento.textContent = personagem.ultimoEvento || "Sem ação recente";
}
function animarAtaque(elemento) {
    if (!elemento) {
        return;
    }
    elemento.classList.remove("hit");
    void elemento.offsetWidth;
    elemento.classList.add("hit");
}
function startBattle(output, healthWelinton, fillWelinton, statusWelinton, cardWelinton, healthPetista, fillPetista, statusPetista, cardPetista) {
    console.log("Função startBattle chamada!");
    try {
        if (!output) {
            console.error("Output não encontrado!");
            return;
        }
        output.textContent = "";
        console.log("Criando personagens...");
        const Welinton = new cavaleiro("Welinton Cavaleiro", 55, 760);
        const Petista = new petista("Goblin Petista", 52, 720);
        console.log("Configurando callbacks...");
        Welinton.setAtualizadorStatus(() => atualizarSaude(Welinton, healthWelinton, fillWelinton, statusWelinton, 760));
        Petista.setAtualizadorStatus(() => atualizarSaude(Petista, healthPetista, fillPetista, statusPetista, 720));
        Welinton.setRegeneracao(12);
        Petista.setRegeneracao(8);
        Welinton.setAnimacaoAtaque(() => animarAtaque(cardWelinton));
        Petista.setAnimacaoAtaque(() => animarAtaque(cardPetista));
        console.log("Atualizando saúde inicial...");
        atualizarSaude(Welinton, healthWelinton, fillWelinton, statusWelinton, 760);
        atualizarSaude(Petista, healthPetista, fillPetista, statusPetista, 720);
        console.log("Iniciando exemplos de ataques...");
        console.log("\n=== Exemplos de Ataques Diferentes ===\n");
        Welinton.atacarComTipo(Petista, "Espada");
        Welinton.atacarComTipo(Petista, "Mãos");
        Welinton.atacarComTipo(Petista, "Duas Espadas");
        console.log("\n=== Iniciando batalha ===\n");
        const game = new jogo();
        game.inicia(Welinton, Petista);
        console.log("Batalha concluída!");
    }
    catch (error) {
        console.error("Erro na função startBattle:", error);
    }
}
// Inicialização automática quando a página carrega
window.addEventListener("load", function () {
    console.log("Página carregada, inicializando jogo...");
    const output = document.getElementById("output");
    const runButton = document.getElementById("run");
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
        runButton.addEventListener("click", function () {
            console.log("Botão clicado! Iniciando batalha...");
            startBattle(output, healthWelinton, fillWelinton, statusWelinton, cardWelinton, healthPetista, fillPetista, statusPetista, cardPetista);
        });
        console.log("Event listener adicionado com sucesso!");
    }
    else {
        console.error("ERRO: Botão 'run' não encontrado!");
    }
});
