// Pure game logic, shared by the browser UI and the Node tests.
const TicTacToe = (() => {
  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  function createBoard() {
    return Array(9).fill(null);
  }

  function opponent(player) {
    return player === "X" ? "O" : "X";
  }

  function availableMoves(board) {
    return board.flatMap((cell, i) => (cell ? [] : [i]));
  }

  function getWinner(board) {
    for (const line of LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { player: board[a], line };
      }
    }
    return null;
  }

  function isDraw(board) {
    return !getWinner(board) && board.every(Boolean);
  }

  // Scores a position from `me`'s point of view. Quicker wins and slower
  // losses score higher, so the AI finishes games instead of toying with you.
  function minimax(board, toMove, me, depth) {
    const winner = getWinner(board);
    if (winner) return winner.player === me ? 10 - depth : depth - 10;

    const moves = availableMoves(board);
    if (moves.length === 0) return 0;

    const scores = moves.map((i) => {
      board[i] = toMove;
      const score = minimax(board, opponent(toMove), me, depth + 1);
      board[i] = null;
      return score;
    });
    return toMove === me ? Math.max(...scores) : Math.min(...scores);
  }

  function bestMove(board, player) {
    const work = board.slice();
    let best = null;
    let bestScore = -Infinity;
    for (const i of availableMoves(work)) {
      work[i] = player;
      const score = minimax(work, opponent(player), player, 1);
      work[i] = null;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    return best;
  }

  function randomMove(board, rng = Math.random) {
    const moves = availableMoves(board);
    return moves.length ? moves[Math.floor(rng() * moves.length)] : null;
  }

  return { createBoard, opponent, availableMoves, getWinner, isDraw, bestMove, randomMove };
})();

if (typeof module !== "undefined") module.exports = TicTacToe;
