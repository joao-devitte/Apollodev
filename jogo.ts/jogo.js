"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // personagem.ts
  var Personagem;
  var init_personagem = __esm({
    "personagem.ts"() {
      "use strict";
      Personagem = class {
        constructor(nome, forca, vida, defesa = 0, cura = 0) {
          this.ultimoEvento = "Sem a\xE7\xE3o recente";
          this.regeneracao = 0;
          this.nome = nome;
          this.forca = forca;
          this.vida = vida;
          this.vidaMaxima = vida;
          this.defesa = defesa;
          this.cura = cura;
        }
        // ─── Setters de configuração ────────────────────────────────────────────────
        setAtualizadorStatus(callback) {
          this.atualizarStatus = callback;
        }
        setRegeneracao(valor) {
          this.regeneracao = valor;
        }
        setAnimacaoAtaque(callback) {
          this.animarHit = callback;
        }
        // ─── Estado do personagem ───────────────────────────────────────────────────
        /**
         * Retorna true enquanto o personagem tiver vida acima de 0
         */
        estaVivo() {
          return this.vida > 0;
        }
        /** Alias mantido para compatibilidade */
        isContinuaVivo() {
          return this.estaVivo();
        }
        // ─── Ações por turno ────────────────────────────────────────────────────────
        /**
         * Regenera vida ao final de cada turno.
         * Só funciona se o personagem estiver vivo e abaixo da vida máxima.
         */
        regenerar() {
          if (this.regeneracao <= 0 || !this.estaVivo() || this.vida >= this.vidaMaxima) {
            return;
          }
          const vidaAnterior = this.vida;
          this.vida = Math.min(this.vidaMaxima, this.vida + this.regeneracao);
          const ganho = this.vida - vidaAnterior;
          this.ultimoEvento = `Regenerou +${ganho} de vida`;
          console.log(`${this.nome} regenerou ${ganho} de vida. Vida atual: ${this.vida}`);
          this.executarCallback(this.atualizarStatus);
        }
        /**
         * Recebe dano, aplica redução de defesa e, se sobreviver com vida baixa,
         * ativa a auto-cura.
         *
         * CORREÇÃO: a auto-cura agora só ocorre se this.vida > 0 após o dano.
         * Antes, o personagem se curava mesmo chegando a 0, impedindo o fim da batalha.
         */
        sofrerAtaque(dano) {
          const danoEfetivo = dano * (1 - this.defesa / 100);
          this.vida = Math.max(0, this.vida - danoEfetivo);
          const danoExibicao = Number(danoEfetivo.toFixed(1));
          console.log(
            `${this.nome} recebeu ${danoExibicao} de dano (reduzido de ${dano}). Vida atual: ${this.vida.toFixed(1)}`
          );
          if (this.vida > 0 && this.vida < 50 && this.cura > 0) {
            const curaAplicada = Math.min(this.cura, this.vidaMaxima - this.vida);
            this.vida += curaAplicada;
            this.ultimoEvento = `Recuperou +${curaAplicada} de vida`;
            console.log(`${this.nome} se curou por ${curaAplicada}. Vida atual: ${this.vida.toFixed(1)}`);
          } else {
            this.ultimoEvento = `Dano: -${danoExibicao} HP`;
          }
          this.executarCallback(this.atualizarStatus);
          this.executarCallback(this.animarHit);
        }
        // ─── Utilitários internos ───────────────────────────────────────────────────
        /**
         * Chama um callback com segurança (verifica se é função antes de executar)
         */
        executarCallback(callback) {
          if (typeof callback === "function") {
            callback(this);
          }
        }
      };
    }
  });

  // ataque.ts
  var Ataque, CatalogoAtaques;
  var init_ataque = __esm({
    "ataque.ts"() {
      "use strict";
      Ataque = class {
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
      };
      CatalogoAtaques = class {
        static {
          this.ataques = /* @__PURE__ */ new Map([
            ["Espada", new Ataque("Espada", 20, "atacou com a espada")],
            ["M\xE3os", new Ataque("M\xE3os", 5, "atacou com as m\xE3os")],
            ["Duas Espadas", new Ataque("Duas Espadas", 25, "atacou com 2 espadas")]
          ]);
        }
        /**
         * Obtém um ataque específico pelo tipo
         */
        static obterAtaque(tipo) {
          return this.ataques.get(tipo);
        }
        /**
         * Obtém todos os ataques disponíveis
         */
        static obterTodosAtaques() {
          return Array.from(this.ataques.values());
        }
      };
    }
  });

  // cavaleiro.ts
  var Cavaleiro;
  var init_cavaleiro = __esm({
    "cavaleiro.ts"() {
      "use strict";
      init_personagem();
      init_ataque();
      Cavaleiro = class extends Personagem {
        // Defesa: 10%, Cura: 25
        constructor(nome, forca, vida) {
          super(nome, forca, vida, 10, 25);
        }
        /**
         * Ataque básico: usa a força do personagem
         */
        atacar(alvo) {
          console.log(`${this.nome} atacou ${alvo.nome}`);
          alvo.sofrerAtaque(this.forca);
        }
        /**
         * Ataque especial: usa um tipo de ataque do catálogo
         * Exemplo: "Espada", "Mãos", "Duas Espadas"
         */
        atacarComTipo(alvo, tipoAtaque) {
          const ataque = CatalogoAtaques.obterAtaque(tipoAtaque);
          if (ataque) {
            console.log(`${this.nome} ${ataque.getDescricao()} contra ${alvo.nome}`);
            console.log(`\u{1F4A5} Dano: ${ataque.getDano()}`);
            alvo.sofrerAtaque(ataque.getDano());
          } else {
            console.log(`Tipo de ataque inv\xE1lido: "${tipoAtaque}"`);
          }
        }
      };
    }
  });

  // Petista.ts
  var Petista;
  var init_Petista = __esm({
    "Petista.ts"() {
      "use strict";
      init_personagem();
      Petista = class extends Personagem {
        // Defesa: 8%, Cura: 10
        constructor(nome, forca, vida) {
          super(nome, forca, vida, 8, 10);
        }
        /**
         * Ataque básico: usa a força do personagem
         */
        atacar(alvo) {
          console.log(`${this.nome} atacou ${alvo.nome}`);
          alvo.sofrerAtaque(this.forca);
        }
      };
    }
  });

  // index.ts
  var require_index = __commonJS({
    "index.ts"() {
      init_cavaleiro();
      init_Petista();
      var logOriginal = console.log.bind(console);
      var erroOriginal = console.error.bind(console);
      function escreverNoOutput(output, ...args) {
        const linha = args.map((item) => typeof item === "object" ? JSON.stringify(item, null, 2) : String(item)).join(" ");
        if (output) {
          output.textContent += linha + "\n";
          output.scrollTop = output.scrollHeight;
        }
      }
      console.log = (...args) => {
        const output = document.getElementById("output");
        escreverNoOutput(output, ...args);
        logOriginal(...args);
      };
      console.error = (...args) => {
        const output = document.getElementById("output");
        escreverNoOutput(output, "[ERRO]", ...args);
        erroOriginal(...args);
      };
      function atualizarBarraSaude(personagem, elementos, vidaMaxima) {
        if (!elementos.hp || !elementos.barraSaude || !elementos.status) return;
        const vidaAtual = Math.max(0, Math.round(personagem.vida));
        const porcentagem = vidaAtual / vidaMaxima * 100;
        elementos.hp.textContent = `HP: ${vidaAtual} / ${vidaMaxima}`;
        elementos.barraSaude.style.width = `${Math.max(0, Math.min(100, porcentagem))}%`;
        elementos.status.textContent = personagem.ultimoEvento || "Sem a\xE7\xE3o recente";
      }
      function animarAtaque(elemento) {
        if (!elemento) return;
        elemento.classList.remove("hit");
        void elemento.offsetWidth;
        elemento.classList.add("hit");
      }
      function configurarPersonagens(welinton, petista, elementosWelinton, elementosPetista) {
        welinton.setAnimacaoAtaque(() => animarAtaque(elementosWelinton.card));
        welinton.setAtualizadorStatus(() => atualizarBarraSaude(welinton, elementosWelinton, welinton.vidaMaxima));
        welinton.setRegeneracao(12);
        petista.setAnimacaoAtaque(() => animarAtaque(elementosPetista.card));
        petista.setAtualizadorStatus(() => atualizarBarraSaude(petista, elementosPetista, petista.vidaMaxima));
        petista.setRegeneracao(8);
      }
      function demonstrarTiposDeAtaque(welinton, petista) {
        console.log("\n=== Exemplos de Ataques Diferentes ===");
        welinton.atacarComTipo(petista, "Espada");
        welinton.atacarComTipo(petista, "M\xE3os");
        welinton.atacarComTipo(petista, "Duas Espadas");
      }
      function esperarMs(ms = 1e3) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      async function executarBatalha(welinton, petista) {
        const MAX_TURNOS = 100;
        for (let turno = 1; turno <= MAX_TURNOS; turno++) {
          console.log(`
${"=".repeat(30)} TURNO ${turno} ${"=".repeat(30)}`);
          welinton.atacar(petista);
          await esperarMs(800);
          if (!petista.estaVivo()) {
            anunciarVencedor(welinton, turno, false);
            return;
          }
          petista.atacar(welinton);
          await esperarMs(800);
          if (!welinton.estaVivo()) {
            anunciarVencedor(petista, turno, false);
            return;
          }
          welinton.regenerar();
          petista.regenerar();
          await esperarMs(400);
        }
        anunciarVencedor(null, MAX_TURNOS, true);
      }
      function anunciarVencedor(vencedor, turno, limiteAtingido) {
        if (limiteAtingido) {
          console.log(`\u23F1\uFE0F Limite de ${turno} turnos atingido! Empate!`);
        } else {
          console.log(`
\u{1F3C6} ${vencedor.nome} ganhou a luta no turno ${turno}!`);
        }
        console.log("Batalha conclu\xEDda!");
      }
      async function iniciarBatalha(output, elementosWelinton, elementosPetista) {
        if (!output) {
          console.error("Elemento output n\xE3o encontrado!");
          return;
        }
        output.textContent = "";
        console.log("\u{1F3AE} Iniciando batalha...");
        try {
          console.log("\u{1F465} Criando personagens...");
          const welinton = new Cavaleiro("Welinton Cavaleiro", 50, 500);
          const petista = new Petista("Goblin Petista", 15, 300);
          console.log("\u2699\uFE0F Configurando interface...");
          configurarPersonagens(welinton, petista, elementosWelinton, elementosPetista);
          demonstrarTiposDeAtaque(welinton, petista);
          console.log("\n\u2694\uFE0F === Iniciando batalha ===");
          await executarBatalha(welinton, petista);
        } catch (erro) {
          console.error("Erro ao iniciar batalha:", erro);
        }
      }
      window.addEventListener("load", () => {
        console.log("\u{1F4C4} P\xE1gina carregada!");
        const output = document.getElementById("output");
        const botaoIniciar = document.getElementById("run");
        const elementosWelinton = {
          hp: document.getElementById("hp-welinton"),
          barraSaude: document.getElementById("health-fill-welinton"),
          status: document.getElementById("status-welinton"),
          card: document.getElementById("card-welinton")
        };
        const elementosPetista = {
          hp: document.getElementById("hp-petista"),
          barraSaude: document.getElementById("health-fill-petista"),
          status: document.getElementById("status-petista"),
          card: document.getElementById("card-petista")
        };
        if (!botaoIniciar) {
          console.error("\u274C Bot\xE3o 'run' n\xE3o encontrado no HTML!");
          return;
        }
        botaoIniciar.addEventListener("click", () => {
          console.log("\u{1F3AE} Bot\xE3o clicado! Iniciando batalha...");
          iniciarBatalha(output, elementosWelinton, elementosPetista);
        });
        console.log("\u2705 Jogo pronto! Clique no bot\xE3o para come\xE7ar.");
      });
    }
  });
  require_index();
})();
