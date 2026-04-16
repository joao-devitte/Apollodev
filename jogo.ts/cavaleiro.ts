import { personagem } from "./personagem.js";
import { CatalogoAtaques } from "./ataque.js";

export class cavaleiro extends personagem{

    constructor(nome: string, forca: number, vida:number,){
        super(nome, forca, vida, 10, 25);
    } 

    public atacar(alvo: personagem): void {
        console.log(`${this.nome} atacou ${alvo.nome}`);
        alvo.sofrerAtaque(this.forca);
    }

    public atacarComTipo(alvo: personagem, tipoAtaque: string): void {
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


