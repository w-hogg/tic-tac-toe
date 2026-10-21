const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createBoard,
  availableMoves,
  getWinner,
  isDraw,
  bestMove,
  randomMove,
} = require("../src/game.js");

// Builds a board from a 9-character string, e.g. "XO.X.O..." ('.' = empty).
const board = (s) => [...s].map((c) => (c === "." ? null : c));

test("empty board has no winner and nine moves", () => {
  const b = createBoard();
  assert.equal(getWinner(b), null);
  assert.equal(isDraw(b), false);
  assert.deepEqual(availableMoves(b), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

test("detects row, column and diagonal wins", () => {
  assert.deepEqual(getWinner(board("XXX.OO...")), { player: "X", line: [0, 1, 2] });
  assert.deepEqual(getWinner(board("OX.OX.O..")), { player: "O", line: [0, 3, 6] });
  assert.deepEqual(getWinner(board("X.O.XO..X")), { player: "X", line: [0, 4, 8] });
  assert.deepEqual(getWinner(board("X.O.OXO.X")), { player: "O", line: [2, 4, 6] });
});

test("full board with no line is a draw", () => {
  const b = board("XOXXOOOXX");
  assert.equal(getWinner(b), null);
  assert.equal(isDraw(b), true);
});

test("full board with a line is a win, not a draw", () => {
  assert.equal(isDraw(board("XXXOOXOXO")), false);
});

test("bestMove takes an immediate win", () => {
  // O can win at 5 (middle row).
  assert.equal(bestMove(board("XX.OO...X"), "O"), 5);
});

test("bestMove blocks the opponent's win", () => {
  // X threatens the top row at 2.
  assert.equal(bestMove(board("XX..O...."), "O"), 2);
});

test("bestMove does not mutate the board", () => {
  const b = board("X...O....");
  const copy = b.slice();
  bestMove(b, "X");
  assert.deepEqual(b, copy);
});

test("unbeatable AI never loses as O against any sequence of X moves", () => {
  let games = 0;
  const explore = (b) => {
    const winner = getWinner(b);
    if (winner) {
      assert.notEqual(winner.player, "X", `X won with board ${b.map((c) => c || ".").join("")}`);
      games++;
      return;
    }
    if (isDraw(b)) {
      games++;
      return;
    }
    for (const i of availableMoves(b)) {
      const afterX = b.slice();
      afterX[i] = "X";
      if (getWinner(afterX) || isDraw(afterX)) {
        explore(afterX);
        continue;
      }
      afterX[bestMove(afterX, "O")] = "O";
      explore(afterX);
    }
  };
  explore(createBoard());
  assert.ok(games > 0);
});

test("randomMove picks an empty cell", () => {
  const b = board("XOX.O.X.O");
  assert.equal(randomMove(b, () => 0), 3);
  assert.equal(randomMove(b, () => 0.99), 7);
  assert.equal(randomMove(board("XOXXOOOXX")), null);
});
