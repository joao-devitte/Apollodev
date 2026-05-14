import { Personagem } from "./personagem.js";
import { CatalogoAtaques } from "./ataque.js";

/**
 * Classe que representa um Cavaleiro
 * Herda de Personagem e possui ataques especializados
 */
export class Cavaleiro extends Personagem {
  // Defesa: 10%, Cura: 25
  constructor(nome: string, forca: number, vida: number) {
    super(nome, forca, vida, 10, 25);
  }

  /**
   * Ataque básico: usa a força do personagem
   */
  public atacar(alvo: Personagem): void {
    console.log(`${this.nome} atacou ${alvo.nome}`);
    alvo.sofrerAtaque(this.forca);
  }

  /**
   * Ataque especial: usa um tipo de ataque do catálogo
   * Exemplo: "Espada", "Mãos", "Duas Espadas"
   */
  public atacarComTipo(alvo: Personagem, tipoAtaque: string): void {
    const ataque = CatalogoAtaques.obterAtaque(tipoAtaque);

    if (ataque) {
      console.log(`${this.nome} ${ataque.getDescricao()} contra ${alvo.nome}`);
      console.log(`💥 Dano: ${ataque.getDano()}`);
      alvo.sofrerAtaque(ataque.getDano());
    } else {
      console.log(`Tipo de ataque inválido: "${tipoAtaque}"`);
    }
  }
}
