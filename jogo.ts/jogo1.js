export class jogo {
    inicia(player1, player2) {
        let turno = 1;
        while (player1.isContinuaVivo() && player2.isContinuaVivo()) {
            console.log("\n============================ TURNO " + turno + " ============================ ");
            player1.atacar(player2);
            if (!player2.isContinuaVivo()) {
                break;
            }
            player2.atacar(player1);
            turno++;
        }
        if (player1.isContinuaVivo()) {
            console.log(`${player1.nome} ganhou a luta.`);
        }
        else {
            console.log(`${player2.nome} ganhou a luta.`);
        }
    }
}
