import { personagem } from "./personagem.js";

export class jogo {
  public async inicia(player1: personagem, player2: personagem) {
    let turno = 1;
    const maxTurnos = 50; 

    while (
      player1.isContinuaVivo() &&
      player2.isContinuaVivo() &&
      turno <= maxTurnos
    ) {
      console.log(
        "\n============================ TURNO " +
          turno +
          " ============================ ",
      );
      (player1 as any).atacar(player2);
      await this.esperartempo();

      if (!player2.isContinuaVivo()) {
        break;
      }

      (player2 as any).atacar(player1);
      await this.esperartempo();


      turno++;
    }

    if (turno > maxTurnos) {
      console.log("Limite de turnos atingido!");
    }

    if (player1.isContinuaVivo()) {
      console.log(`${player1.nome} ganhou a luta.`);
    } else {
      console.log(`${player2.nome} ganhou a luta.`);
    }
  }

  public esperartempo() {
    const milliseconds = 800;
    return new Promise((x) => setTimeout(x, milliseconds));
  }
}
