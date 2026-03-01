export type Board = (string | null)[];

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function checkWinner(board: Board): { winner: string | null; line: number[] | null } {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line };
    }
  }
  if (board.every((cell) => cell !== null)) return { winner: "draw", line: null };
  return { winner: null, line: null };
}

function minimax(board: Board, isMaximizing: boolean, depth: number): number {
  const { winner } = checkWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (winner === "draw") return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false, depth + 1));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true, depth + 1));
        board[i] = null;
      }
    }
    return best;
  }
}

export function getBotMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  const b = [...board];

  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = "O";
      const score = minimax(b, false, 0);
      b[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}
