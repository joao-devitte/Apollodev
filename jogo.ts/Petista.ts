import { personagem } from "./personagem.js";

export class petista extends personagem{

    constructor(nome: string, forca: number, vida:number){
        super(nome, forca, vida);
    } 

    public atacar(Petista: personagem): void {
        console.log(`${this.nome} atacou ${Petista.nome}`);
    }

}