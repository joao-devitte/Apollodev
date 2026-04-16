import { personagem } from "./personagem.js";
export class petista extends personagem {
    constructor(nome, forca, vida) {
        super(nome, forca, vida);
    }
    atacar(Petista) {
        console.log(`${this.nome} atacou ${Petista.nome}`);
    }
}
