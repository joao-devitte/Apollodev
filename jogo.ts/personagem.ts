export abstract class personagem{

    public nome: string = "personagem";
    protected forca: number = 0;
    protected vida: number = 0;
    public vidaMaxima: number = 0;
    protected defesa: number = 0;
    protected cura: number = 0;
    protected regeneracao: number = 0;
    public ultimoEvento: string = "Sem ação recente";
    protected atualizarStatus?: (personagem: personagem) => void;
    protected animarHit?: (personagem: personagem) => void;

    constructor(nome: string, forca: number, vida:number, defesa: number = 0, cura: number = 0){
        this.nome = nome;
        this.forca = forca;
        this.vida = vida;
        this.vidaMaxima = vida;
        this.defesa = defesa;
        this.cura = cura;
    }

    setAtualizadorStatus(callback: (personagem: personagem) => void): void {
        this.atualizarStatus = callback;
    }

    setRegeneracao(valor: number): void {
        this.regeneracao = valor;
    }

    setAnimacaoAtaque(callback: (personagem: personagem) => void): void {
        this.animarHit = callback;
    }

    regenerar(): void {
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

    isContinuaVivo(): boolean {
        return this.vida > 0;
    }

    sofrerAtaque(dano: number): void{
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

        if (typeof this.atualizarStatus === 'function') {
            this.atualizarStatus(this);
        }

        if (typeof this.animarHit === 'function') {
            this.animarHit(this);
        }
    }
}