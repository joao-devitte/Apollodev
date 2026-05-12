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
  var personagem;
  var init_personagem = __esm({
    "personagem.ts"() {
      "use strict";
      personagem = class {
        constructor(nome, forca, vida, defesa = 0, cura = 0) {
          this.nome = "personagem";
          this.forca = 0;
          this.vida = 0;
          this.vidaMaxima = 0;
          this.defesa = 0;
          this.cura = 0;
          this.regeneracao = 0;
          this.ultimoEvento = "Sem a\xE7\xE3o recente";
          this.nome = nome;
          this.forca = forca;
          this.vida = vida;
          this.vidaMaxima = vida;
          this.defesa = defesa;
          this.cura = cura;
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
            if (typeof this.atualizarStatus === "function") {
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
          if (typeof this.atualizarStatus === "function") {
            this.atualizarStatus(this);
          }
          if (typeof this.animarHit === "function") {
            this.animarHit(this);
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
        static obterAtaque(tipo) {
          return this.ataques.get(tipo);
        }
        static obterTodosAtaques() {
          return Array.from(this.ataques.values());
        }
      };
    }
  });

  // cavaleiro.ts
  var cavaleiro;
  var init_cavaleiro = __esm({
    "cavaleiro.ts"() {
      "use strict";
      init_personagem();
      init_ataque();
      cavaleiro = class extends personagem {
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
            console.log(`\u{1F4A5} Dano: ${ataque.getDano()}`);
            alvo.sofrerAtaque(ataque.getDano());
          } else {
            console.log("Tipo de ataque inv\xE1lido!");
          }
        }
      };
    }
  });

  // Petista.ts
  var petista;
  var init_Petista = __esm({
    "Petista.ts"() {
      "use strict";
      init_personagem();
      petista = class extends personagem {
        constructor(nome, forca, vida) {
          super(nome, forca, vida, 8, 10);
        }
        atacar(alvo) {
          console.log(`${this.nome} atacou ${alvo.nome}`);
          alvo.sofrerAtaque(this.forca);
        }
      };
    }
  });

  // jogo1.ts
  var jogo;
  var init_jogo1 = __esm({
    "jogo1.ts"() {
      "use strict";
      jogo = class {
        async inicia(player1, player2) {
          let turno = 1;
          const maxTurnos = 100;
          while (player1.isContinuaVivo() && player2.isContinuaVivo() && turno <= maxTurnos) {
            console.log(
              "\n============================ TURNO " + turno + " ============================ "
            );
            player1.atacar(player2);
            await this.esperartempo();
            if (!player2.isContinuaVivo()) {
              break;
            }
            player2.atacar(player1);
            await this.esperartempo();
            player1.regenerar();
            player2.regenerar();
            turno++;
          }
          if (turno > maxTurnos) {
            console.log("Limite de turnos atingido!");
          }
          if (player1.isContinuaVivo()) {
            console.log(`${player1.nome} ganhou a luta.`);
          } else {
            console.log(`${player2.nome} ganhou a luta.`);
          }
        }
        esperartempo() {
          const milliseconds = 800;
          return new Promise((x) => setTimeout(x, milliseconds));
        }
      };
    }
  });

  // index.ts
  var require_index = __commonJS({
    "index.ts"() {
      init_cavaleiro();
      init_Petista();
      init_jogo1();
      var originalLog = console.log.bind(console);
      var originalError = console.error.bind(console);
      function appendLog(output, ...args) {
        const text = args.map((item) => typeof item === "object" ? JSON.stringify(item, null, 2) : String(item)).join(" ");
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
      console.error = (...args) => {
        const output = document.getElementById("output");
        appendLog(output, "[ERRO]", ...args);
        originalError(...args);
      };
      function atualizarSaude(personagem2, elementoTexto, elementoBarra, elementoEvento, vidaMaxima) {
        if (!elementoTexto || !elementoBarra || !elementoEvento) {
          return;
        }
        const valor = Math.max(0, Math.round(personagem2.vida));
        elementoTexto.textContent = `HP: ${valor} / ${vidaMaxima}`;
        elementoBarra.style.width = `${Math.max(0, Math.min(100, valor / vidaMaxima * 100))}%`;
        elementoEvento.textContent = personagem2.ultimoEvento || "Sem a\xE7\xE3o recente";
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
        console.log("Fun\xE7\xE3o startBattle chamada!");
        try {
          if (!output) {
            console.error("Output n\xE3o encontrado!");
            return;
          }
          output.textContent = "";
          console.log("Criando personagens...");
          const Welinton = new cavaleiro("Welinton Cavaleiro", 55, 500);
          const PetistaInimigo = new petista("Goblin Petista", 15, 300);
          console.log("Configurando callbacks...");
          Welinton.setAtualizadorStatus(() => atualizarSaude(Welinton, healthWelinton, fillWelinton, statusWelinton, 500));
          PetistaInimigo.setAtualizadorStatus(() => atualizarSaude(PetistaInimigo, healthPetista, fillPetista, statusPetista, 300));
          Welinton.setRegeneracao(12);
          PetistaInimigo.setRegeneracao(8);
          Welinton.setAnimacaoAtaque(() => animarAtaque(cardWelinton));
          PetistaInimigo.setAnimacaoAtaque(() => animarAtaque(cardPetista));
          console.log("Atualizando sa\xFAde inicial...");
          console.log("Iniciando exemplos de ataques...");
          console.log("\n=== Exemplos de Ataques Diferentes ===\n");
          Welinton.atacarComTipo(PetistaInimigo, "Espada");
          Welinton.atacarComTipo(PetistaInimigo, "M\xE3os");
          Welinton.atacarComTipo(PetistaInimigo, "Duas Espadas");
          console.log("\n=== Iniciando batalha ===\n");
          const game = new jogo();
          executarBatalhaAssincrona(game, Welinton, PetistaInimigo, output);
        } catch (error) {
          console.error("Erro na fun\xE7\xE3o startBattle:", error);
        }
      }
      function executarBatalhaAssincrona(game, player1, player2, output) {
        let turno = 1;
        const maxTurnos = 50;
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
            console.log("Batalha conclu\xEDda!");
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
            console.log("Batalha conclu\xEDda!");
            return;
          }
          player2.atacar(player1);
          player1.regenerar();
          player2.regenerar();
          turno++;
          requestAnimationFrame(executarTurno);
        }
        requestAnimationFrame(executarTurno);
      }
      window.addEventListener("load", function() {
        console.log("P\xE1gina carregada, inicializando jogo...");
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
          console.log("Bot\xE3o encontrado, adicionando event listener...");
          runButton.addEventListener("click", function() {
            console.log("Bot\xE3o clicado! Iniciando batalha...");
            startBattle(output, healthWelinton, fillWelinton, statusWelinton, cardWelinton, healthPetista, fillPetista, statusPetista, cardPetista);
          });
          console.log("Event listener adicionado com sucesso!");
        } else {
          console.error("ERRO: Bot\xE3o 'run' n\xE3o encontrado!");
        }
      });
    }
  });
  require_index();
})();
