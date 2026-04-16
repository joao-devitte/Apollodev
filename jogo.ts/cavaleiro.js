import { personagem } from "./personagem.js";
import { CatalogoAtaques } from "./ataque.js";
export class cavaleiro extends personagem {
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
        }
        else {
            console.log("Tipo de ataque inválido!");
        }
    }
}
