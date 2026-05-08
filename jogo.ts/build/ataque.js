export class Ataque {
    constructor(tipo, dano, descricao) {
        this.tipo = tipo;
        this.dano = dano;
        this.descricao = descricao;
    }
    getTipo() {
        return this.tipo;
    }
    getDano() {
        return this.dano;
    }
    getDescricao() {
        return this.descricao;
    }
}
export class CatalogoAtaques {
    static obterAtaque(tipo) {
        return this.ataques.get(tipo);
    }
    static obterTodosAtaques() {
        return Array.from(this.ataques.values());
    }
}
CatalogoAtaques.ataques = new Map([
    ["Espada", new Ataque("Espada", 20, "atacou com a espada")],
    ["Mãos", new Ataque("Mãos", 5, "atacou com as mãos")],
    ["Duas Espadas", new Ataque("Duas Espadas", 25, "atacou com 2 espadas")]
]);
