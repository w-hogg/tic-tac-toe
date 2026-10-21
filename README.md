# Tic Tac Toe

A small, dependency-free tic-tac-toe game that runs in the browser.

- **2 players** on the same device, or play **against the computer**
- Two AI levels: **easy** (random moves) and **unbeatable** (minimax search)
- Winning line highlight, running scoreboard, light/dark theme, keyboard and screen-reader friendly

## Play

Open `index.html` in any modern browser. No build step or server needed.

You can also host it as-is on GitHub Pages: enable Pages for the `main` branch, root folder.

## Test

The game logic in `src/game.js` is covered by Node's built-in test runner (Node 18+):

```sh
npm test
```

The suite includes an exhaustive check that the unbeatable AI never loses as O against every possible sequence of X moves.

## Project layout

```
index.html        page markup
style.css         styles
src/game.js       pure game logic: win detection, minimax AI
src/main.js       DOM wiring and game state
test/game.test.js tests for the game logic
```
