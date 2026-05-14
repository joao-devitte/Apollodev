import { Personagem } from "./personagem.js";

/**
 * Classe que representa um Petista (inimigo)
 * Herda de Personagem com stats específicos
 */
export class Petista extends Personagem {
  // Defesa: 8%, Cura: 10
  constructor(nome: string, forca: number, vida: number) {
    super(nome, forca, vida, 8, 10);
  }

  /**
   * Ataque básico: usa a força do personagem
   */
  public atacar(alvo: Personagem): void {
    console.log(`${this.nome} atacou ${alvo.nome}`);
    alvo.sofrerAtaque(this.forca);
  }
}
