export abstract class personagem{

    public nome: string = "personagem";
    protected forca: number = 0;
    protected vida: number = 0;
    protected defesa: number = 0;
    protected cura: number = 0;
   

constructor(nome: string, forca: number, vida:number, defesa: number = 0, cura: number = 0){
        this.nome = nome;
        this.forca = forca;
        this.vida = vida;
        this.defesa = defesa;
        this.cura = cura;
     
    } 

    isContinuaVivo(): boolean {
        return this.vida > 0;
    }

    sofrerAtaque(dano: number): void{
        let danoEfetivo = dano * (1 - this.defesa / 100);
        this.vida = this.vida - danoEfetivo;
        console.log(`${this.nome} recebeu ${danoEfetivo} de dano (reduzido de ${dano}). vida atual: ${this.vida}`);
        
        if (this.vida < 50 && this.cura > 0) {
            this.vida += this.cura;
            console.log(`${this.nome} se curou por ${this.cura}. Vida atual: ${this.vida}`);
        }
    }

public abstract atacar(persona: personagem): void;

    gerarAtaque(){
        let maximoAtk = 3;
        return Math.floor(Math.random() * maximoAtk);
    }



}

