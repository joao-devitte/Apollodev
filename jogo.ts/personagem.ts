/**
 * Classe abstrata que representa um personagem no jogo
 * Define atributos e comportamentos comuns a todos os personagens
 */
export abstract class Personagem {
  // Atributos públicos
  public nome: string;
  public vidaMaxima: number;
  public ultimoEvento: string = "Sem ação recente";

  // Atributos protegidos (apenas para subclasses)
  protected forca: number;
  protected vida: number;
  protected defesa: number;
  protected cura: number;
  protected regeneracao: number = 0;

  // Callbacks para atualizar UI
  protected atualizarStatus?: (personagem: Personagem) => void;
  protected animarHit?: (personagem: Personagem) => void;

  constructor(nome: string, forca: number, vida: number, defesa: number = 0, cura: number = 0) {
    this.nome = nome;
    this.forca = forca;
    this.vida = vida;
    this.vidaMaxima = vida;
    this.defesa = defesa;
    this.cura = cura;
  }

  /**
   * Define a função que será chamada para atualizar o status na UI
   */
  public setAtualizadorStatus(callback: (personagem: Personagem) => void): void {
    this.atualizarStatus = callback;
  }

  /**
   * Define a quantidade de vida regenerada por turno
   */
  public setRegeneracao(valor: number): void {
    this.regeneracao = valor;
  }

  /**
   * Define a animação que ocorre quando o personagem é atingido
   */
  public setAnimacaoAtaque(callback: (personagem: Personagem) => void): void {
    this.animarHit = callback;
  }

  /**
   * Regenera vida do personagem a cada turno
   */
  public regenerar(): void {
    // Valida se pode regenerar
    if (this.regeneracao <= 0 || !this.estaVivo() || this.vida >= this.vidaMaxima) {
      return;
    }

    const vidaAnterior = this.vida;
    this.vida = Math.min(this.vidaMaxima, this.vida + this.regeneracao);

    // Se regenerou algo, atualiza o evento e avisa a UI
    if (this.vida > vidaAnterior) {
      const ganho = this.vida - vidaAnterior;
      this.ultimoEvento = `Regenerou +${ganho} de vida`;
      console.log(`${this.nome} regenerou ${ganho} de vida. Vida atual: ${this.vida}`);
      this.executarCallback(this.atualizarStatus);
    }
  }

  /**
   * Verifica se o personagem ainda está vivo
   */
  public estaVivo(): boolean {
    return this.vida > 0;
  }

  /**
   * Método antigo para compatibilidade - redireciona para estaVivo()
   */
  public isContinuaVivo(): boolean {
    return this.estaVivo();
  }

  /**
   * Recebe dano e aplica defesa
   * Pode se curar automaticamente se a vida cair abaixo de 50
   */
  public sofrerAtaque(dano: number): void {
    // Calcula dano efetivo com redução de defesa
    const danoEfetivo = dano * (1 - this.defesa / 100);
    this.vida = Math.max(0, this.vida - danoEfetivo);
    const danoExibicao = Number(danoEfetivo.toFixed(1));

    console.log(
      `${this.nome} recebeu ${danoExibicao} de dano (reduzido de ${dano}). Vida atual: ${this.vida.toFixed(1)}`
    );

    // Auto-cura se vida ficar muito baixa
    if (this.vida < 50 && this.cura > 0) {
      const curaAplicada = Math.min(this.cura, this.vidaMaxima - this.vida);
      this.vida += curaAplicada;
      this.ultimoEvento = `Recuperou +${curaAplicada} de vida`;
      console.log(`${this.nome} se curou por ${curaAplicada}. Vida atual: ${this.vida.toFixed(1)}`);
    } else {
      this.ultimoEvento = `Dano: -${danoExibicao} HP`;
    }

    // Atualiza UI e anima
    this.executarCallback(this.atualizarStatus);
    this.executarCallback(this.animarHit);
  }

  /**
   * Executa um callback de forma segura, verificando se é função
   */
  protected executarCallback(callback: ((personagem: Personagem) => void) | undefined): void {
    if (typeof callback === "function") {
      callback(this);
    }
  }
}
