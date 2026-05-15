/**
 * Classe abstrata que representa um personagem no jogo
 * Define atributos e comportamentos comuns a todos os personagens
 */
export abstract class Personagem {
  // Atributos públicos
  public nome: string;
  public vida: number;          // era "protected" — main.ts precisa ler para a barra de HP
  public vidaMaxima: number;
  public ultimoEvento: string = "Sem ação recente";

  // Atributos protegidos (apenas para subclasses)
  protected forca: number;
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

  // ─── Setters de configuração ────────────────────────────────────────────────

  public setAtualizadorStatus(callback: (personagem: Personagem) => void): void {
    this.atualizarStatus = callback;
  }

  public setRegeneracao(valor: number): void {
    this.regeneracao = valor;
  }

  public setAnimacaoAtaque(callback: (personagem: Personagem) => void): void {
    this.animarHit = callback;
  }

  // ─── Estado do personagem ───────────────────────────────────────────────────

  /**
   * Retorna true enquanto o personagem tiver vida acima de 0
   */
  public estaVivo(): boolean {
    return this.vida > 0;
  }

  /** Alias mantido para compatibilidade */
  public isContinuaVivo(): boolean {
    return this.estaVivo();
  }

  // ─── Ações por turno ────────────────────────────────────────────────────────

  /**
   * Regenera vida ao final de cada turno.
   * Só funciona se o personagem estiver vivo e abaixo da vida máxima.
   */
  public regenerar(): void {
    if (this.regeneracao <= 0 || !this.estaVivo() || this.vida >= this.vidaMaxima) {
      return;
    }

    const vidaAnterior = this.vida;
    this.vida = Math.min(this.vidaMaxima, this.vida + this.regeneracao);
    const ganho = this.vida - vidaAnterior;

    this.ultimoEvento = `Regenerou +${ganho} de vida`;
    console.log(`${this.nome} regenerou ${ganho} de vida. Vida atual: ${this.vida}`);
    this.executarCallback(this.atualizarStatus);
  }

  /**
   * Recebe dano, aplica redução de defesa e, se sobreviver com vida baixa,
   * ativa a auto-cura.
   *
   * CORREÇÃO: a auto-cura agora só ocorre se this.vida > 0 após o dano.
   * Antes, o personagem se curava mesmo chegando a 0, impedindo o fim da batalha.
   */
  public sofrerAtaque(dano: number): void {
    // Calcula e aplica dano com redução de defesa
    const danoEfetivo = dano * (1 - this.defesa / 100);
    this.vida = Math.max(0, this.vida - danoEfetivo);
    const danoExibicao = Number(danoEfetivo.toFixed(1));

    console.log(
      `${this.nome} recebeu ${danoExibicao} de dano (reduzido de ${dano}). Vida atual: ${this.vida.toFixed(1)}`
    );

    // ✅ CORRIGIDO: verifica this.vida > 0 antes de curar
    // Antes era apenas "this.vida < 50", então curava mesmo quem chegava a 0
    if (this.vida > 0 && this.vida < 50 && this.cura > 0) {
      const curaAplicada = Math.min(this.cura, this.vidaMaxima - this.vida);
      this.vida += curaAplicada;
      this.ultimoEvento = `Recuperou +${curaAplicada} de vida`;
      console.log(`${this.nome} se curou por ${curaAplicada}. Vida atual: ${this.vida.toFixed(1)}`);
    } else {
      this.ultimoEvento = `Dano: -${danoExibicao} HP`;
    }

    // Atualiza a barra de HP e dispara animação de hit
    this.executarCallback(this.atualizarStatus);
    this.executarCallback(this.animarHit);
  }

  // ─── Utilitários internos ───────────────────────────────────────────────────

  /**
   * Chama um callback com segurança (verifica se é função antes de executar)
   */
  protected executarCallback(callback: ((personagem: Personagem) => void) | undefined): void {
    if (typeof callback === "function") {
      callback(this);
    }
  }
}