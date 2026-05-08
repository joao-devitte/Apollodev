# Jogo de Batalha - TypeScript

Um jogo de batalha por turnos desenvolvido em TypeScript puro, HTML e CSS.

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o navegador em `http://localhost:5173`

## Funcionalidades

- Batalha por turnos entre Cavaleiro e Petista
- Sistema de vida com regeneração automática
- Animações de ataque
- Interface visual com barras de vida
- Logs detalhados da batalha

## Arquitetura

- **TypeScript**: Lógica do jogo e classes
- **HTML**: Estrutura da interface
- **CSS**: Estilos e animações
- **Vite**: Bundler e servidor de desenvolvimento

## Estrutura do projeto

```
├── index.html          # Interface principal
├── index.ts           # Ponto de entrada
├── personagem.ts      # Classe base dos personagens
├── cavaleiro.ts       # Classe do Cavaleiro
├── Petista.ts         # Classe do Petista
├── jogo1.ts           # Lógica do jogo
├── ataque.ts          # Sistema de ataques
├── vite.config.ts     # Configuração do Vite
└── package.json       # Dependências
```