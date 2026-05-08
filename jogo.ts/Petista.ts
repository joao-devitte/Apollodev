import { personagem } from "./personagem.js";

export class petista extends personagem{

    constructor(nome: string, forca: number, vida:number){
        super(nome, forca, vida, 8, 10);
    }

    public atacar(alvo: personagem): void {
        console.log(`${this.nome} atacou ${alvo.nome}`);
        alvo.sofrerAtaque(this.forca);
    }

}