export class personagem {
    constructor(nome, forca, vida, defesa = 0, cura = 0) {
        this.nome = "personagem";
        this.forca = 0;
        this.vida = 0;
        this.defesa = 0;
        this.cura = 0;
        this.nome = nome;
        this.forca = forca;
        this.vida = vida;
        this.defesa = defesa;
        this.cura = cura;
    }
    isContinuaVivo() {
        return this.vida > 0;
    }
    sofrerAtaque(dano) {
        let danoEfetivo = dano * (1 - this.defesa / 100);
        this.vida = this.vida - danoEfetivo;
        console.log(`${this.nome} recebeu ${danoEfetivo} de dano (reduzido de ${dano}). vida atual: ${this.vida}`);
        if (this.vida < 50 && this.cura > 0) {
            this.vida += this.cura;
            console.log(`${this.nome} se curou por ${this.cura}. Vida atual: ${this.vida}`);
        }
    }
    gerarAtaque() {
        let maximoAtk = 3;
        return Math.floor(Math.random() * maximoAtk);
    }
}
