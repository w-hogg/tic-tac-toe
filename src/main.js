(() => {
  const { createBoard, opponent, getWinner, isDraw, bestMove, randomMove } = TicTacToe;

  const AI_PLAYER = "O";
  const AI_DELAY_MS = 350;

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const modeEl = document.getElementById("mode");
  const newRoundBtn = document.getElementById("new-round");
  const resetBtn = document.getElementById("reset-scores");
  const scoreEls = {
    X: document.getElementById("score-x"),
    O: document.getElementById("score-o"),
    draw: document.getElementById("score-draw"),
  };
  const labelEls = {
    X: document.getElementById("label-x"),
    O: document.getElementById("label-o"),
  };

  const state = {
    board: createBoard(),
    current: "X",
    result: null, // { winner: "X" | "O" | null, line: number[] } once the round ends
    scores: { X: 0, O: 0, draw: 0 },
    aiTimer: null,
  };

  const cells = Array.from({ length: 9 }, (_, i) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.addEventListener("click", () => {
      if (!isAiTurn()) play(i);
    });
    boardEl.appendChild(cell);
    return cell;
  });

  function vsComputer() {
    return modeEl.value !== "pvp";
  }

  function isAiTurn() {
    return vsComputer() && !state.result && state.current === AI_PLAYER;
  }

  function play(index) {
    if (state.result || state.board[index]) return;
    state.board[index] = state.current;

    const win = getWinner(state.board);
    if (win) {
      state.result = { winner: win.player, line: win.line };
      state.scores[win.player]++;
    } else if (isDraw(state.board)) {
      state.result = { winner: null, line: [] };
      state.scores.draw++;
    } else {
      state.current = opponent(state.current);
    }

    render();
    if (isAiTurn()) {
      state.aiTimer = setTimeout(() => {
        state.aiTimer = null;
        const move = modeEl.value === "easy"
          ? randomMove(state.board)
          : bestMove(state.board, AI_PLAYER);
        play(move);
      }, AI_DELAY_MS);
    }
  }

  function newRound() {
    clearTimeout(state.aiTimer);
    state.aiTimer = null;
    state.board = createBoard();
    state.current = "X";
    state.result = null;
    render();
  }

  function resetScores() {
    state.scores = { X: 0, O: 0, draw: 0 };
    newRound();
  }

  function name(player) {
    if (!vsComputer()) return player;
    return player === AI_PLAYER ? "Computer" : "You";
  }

  function statusText() {
    const { result, current } = state;
    if (result) {
      if (!result.winner) return "It's a draw!";
      if (!vsComputer()) return `${result.winner} wins!`;
      return result.winner === AI_PLAYER ? "Computer wins!" : "You win!";
    }
    if (isAiTurn()) return "Computer is thinking…";
    return vsComputer() ? "Your turn (X)" : `${current}'s turn`;
  }

  function render() {
    const winLine = state.result ? state.result.line : [];
    state.board.forEach((mark, i) => {
      const cell = cells[i];
      cell.textContent = mark || "";
      cell.dataset.mark = mark || "";
      cell.disabled = Boolean(mark || state.result);
      cell.classList.toggle("win", winLine.includes(i));
      cell.setAttribute(
        "aria-label",
        `Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}: ${mark || "empty"}`
      );
    });

    boardEl.dataset.turn = state.result ? "" : state.current;
    boardEl.classList.toggle("waiting", isAiTurn());
    statusEl.textContent = statusText();

    labelEls.X.textContent = vsComputer() ? "You (X)" : "Player X";
    labelEls.O.textContent = vsComputer() ? "Computer (O)" : "Player O";
    for (const key of Object.keys(scoreEls)) {
      scoreEls[key].textContent = state.scores[key];
    }
  }

  newRoundBtn.addEventListener("click", newRound);
  resetBtn.addEventListener("click", resetScores);
  modeEl.addEventListener("change", resetScores);

  render();
})();
