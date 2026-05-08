export class personagem {
    constructor(nome, forca, vida, defesa = 0, cura = 0) {
        this.nome = "personagem";
        this.forca = 0;
        this.vida = 0;
        this.vidaMaxima = 0;
        this.defesa = 0;
        this.cura = 0;
        this.regeneracao = 0;
        this.ultimoEvento = "Sem ação recente";
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
            if (typeof this.atualizarStatus === 'function') {
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
        }
        else {
            this.ultimoEvento = `Dano: -${danoExibicao} HP`;
        }
        if (typeof this.atualizarStatus === 'function') {
            this.atualizarStatus(this);
        }
        if (typeof this.animarHit === 'function') {
            this.animarHit(this);
        }
    }
}
