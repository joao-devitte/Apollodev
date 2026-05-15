import { moveSyntheticComments } from "typescript";

class Personagem {
    constructor(nome, forca, vida, defesa = 0, cura = 0) {
        this.nome = nome;
        this.forca = forca;
        this.vida = vida;
        this.vidaMaxima = vida;
        this.defesa = defesa;
        this.cura = cura;
        this.regeneracao = 0;
        this.ultimoEvento = "Sem ação recente";
    }

    setAtualizadorStatus(callback) {
        this.atualizarStatus = callback;
    }

    setRegeneracao(valor) { 
        this.regeneracao = valor;
    }

    setAnimacaoAtaque(callback) {
        this.animarHit = callback;
    }

    regenerar() {
        if (this.regeneracao <= 0 || !this.isContinuaVivo() || this.vida >= this.vidaMaxima) {
            return;
        }

        const antes = this.vida;
        this.vida = Math.min(this.vidaMaxima, this.vida + this.regeneracao);

        if (this.vida > antes) {
            const ganho = this.vida - antes;
            this.ultimoEvento = `Regenerou +${ganho} de vida`;
            console.log(`${this.nome} regenerou ${ganho} de vida. Vida atual: ${this.vida}`);
            if (typeof this.atualizarStatus === 'function') {
                this.atualizarStatus(this);
            }
        }
    }

    isContinuaVivo() {
        return this.vida > 0;
    }

    sofrerAtaque(dano) {
        const danoEfetivo = dano * (1 - this.defesa / 100);
        this.vida = Math.max(0, this.vida - danoEfetivo);
        const danoExibicao = Number(danoEfetivo.toFixed(1));
        console.log(`${this.nome} recebeu ${danoExibicao} de dano (reduzido de ${dano}). vida atual: ${this.vida.toFixed(1)}`);

        if (this.vida < 50 && this.cura > 0) {
            const curaAplicada = Math.min(this.cura, this.vidaMaxima - this.vida);
            this.vida += curaAplicada;
            this.ultimoEvento = `Recuperou +${curaAplicada} de vida`;
            console.log(`${this.nome} se curou por ${curaAplicada}. Vida atual: ${this.vida.toFixed(1)}`);
        } else {
            this.ultimoEvento = `Dano: -${danoExibicao} HP`;
        }

        if (typeof this.atualizarStatus === 'function') {
            this.atualizarStatus(this);
        }

        if (typeof this.animarHit === 'function') {
            this.animarHit(this);
        }
    }
}


class Cavaleiro extends Personagem {
    constructor(nome, forca, vida) {
        super(nome, forca, vida, 10, 25);
    }

    atacar(alvo) {
        console.log(`${this.nome} atacou ${alvo.nome}`);
        alvo.sofrerAtaque(this.forca);
    }

    atacarComTipo(alvo, tipoAtaque) {
        const ataque = CatalogoAtaques.obterAtaque(tipoAtaque);

        if (ataque) {
            console.log(`${this.nome} ${ataque.getDescricao()} contra ${alvo.nome}`);
            console.log(`💥 Dano: ${ataque.getDano()}`);
            alvo.sofrerAtaque(ataque.getDano());
        } else {
            console.log("Tipo de ataque inválido!");
        }
    }
}


class Petista extends Personagem {
    constructor(nome, forca, vida) {
        super(nome, forca, vida, 8, 10);
    }

    atacar(alvo) {
        console.log(`${this.nome} atacou ${alvo.nome}`);
        alvo.sofrerAtaque(this.forca);
    }
}


class Ataque {
    constructor(tipo, dano, descricao) {
        this.tipo = tipo;
        this.dano = dano;
        this.descricao = descricao;
    }

    getTipo() {
        return this.tipo;
    }

    getDano() {
        return this.dano;
    }

    getDescricao() {
        return this.descricao;
    }
}


class CatalogoAtaques {
    static ataques = new Map([
        ["Espada", new Ataque("Espada", 20, "atacou com a espada")],
        ["Mãos", new Ataque("Mãos", 5, "atacou com as mãos")],
        ["Duas Espadas", new Ataque("Duas Espadas", 25, "atacou com 2 espadas")]
    ]);

    static obterAtaque(tipo) {
        return this.ataques.get(tipo);
    }

    static obterTodosAtaques() {
        return Array.from(this.ataques.values());
    }
}


class Jogo {
    inicia(player1, player2) {
        let turno = 1;
        while (player1.isContinuaVivo() && player2.isContinuaVivo()) {
            console.log("\n============================ TURNO " + turno + " ============================ ");
            player1.atacar(player2);

            if (!player2.isContinuaVivo()) {
                break;
            }

            player2.atacar(player1);
            player1.regenerar();
            player2.regenerar();

            turno++;
        }

        if (player1.isContinuaVivo()) {
            console.log(`${player1.nome} ganhou a luta.`);
        } else {
            console.log(`${player2.nome} ganhou a luta.`);
        }
    }
}


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
        const Welinton = new Cavaleiro("Welinton Cavaleiro", 55, 450);
        const Petista = new Petista("Goblin Petista", 30, 200);

        console.log("Configurando callbacks...");
        Welinton.setAtualizadorStatus(() => atualizarSaude(Welinton, healthWelinton, fillWelinton, statusWelinton, 40));
        Petista.setAtualizadorStatus(() => atualizarSaude(Petista, healthPetista, fillPetista, statusPetista, 40));

        Welinton.setRegeneracao(20);
        Petista.setRegeneracao(5);              

        Welinton.setAnimacaoAtaque(() => animarAtaque(cardWelinton));
        Petista.setAnimacaoAtaque(() => animarAtaque(cardPetista));

        
        console.log("Iniciando exemplos de ataques...");
        console.log("\n=== Exemplos de Ataques Diferentes ===\n");
        Welinton.atacarComTipo(Petista, "Espada");
        Welinton.atacarComTipo(Petista, "Mãos");
        Welinton.atacarComTipo(Petista, "Duas Espadas");

        console.log("\n=== Iniciando batalha ===\n");
        const game = new Jogo();
        game.inicia(Welinton, Petista);
        console.log("Batalha concluída!");
    } catch (error) {
        console.error("Erro na função startBattle:", error);
    }
}

//botao iniciar
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
;
