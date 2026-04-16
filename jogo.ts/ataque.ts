export type TipoAtaque = string;

export class Ataque {
    private tipo: string;
    private dano: number;
    private descricao: string;

    constructor(tipo: string, dano: number, descricao: string) {
        this.tipo = tipo;
        this.dano = dano;
        this.descricao = descricao;
    }

    public getTipo(): string {
        return this.tipo;
    }

    public getDano(): number {
        return this.dano;
    }

    public getDescricao(): string {
        return this.descricao;
    }
}

export class CatalogoAtaques {
    private static ataques: Map<string, Ataque> = new Map([
        ["Espada", new Ataque("Espada", 20, "atacou com a espada")],
        ["Mãos", new Ataque("Mãos", 5, "atacou com as mãos")],
        ["Duas Espadas", new Ataque("Duas Espadas", 25, "atacou com 2 espadas")]
    ]);

    public static obterAtaque(tipo: string): Ataque | undefined {
        return this.ataques.get(tipo);
    }

    public static obterTodosAtaques(): Ataque[] {
        return Array.from(this.ataques.values());
    }
}
