import { personagem } from "./personagem.js";
export class petista extends personagem {
    constructor(nome, forca, vida) {
        super(nome, forca, vida, 8, 10);
    }
    atacar(alvo) {
        console.log(`${this.nome} atacou ${alvo.nome}`);
        alvo.sofrerAtaque(this.forca);
    }
}
