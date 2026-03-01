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

function getWinningMove(board: Board, player: string): number {
  for (const [a, b, c] of WIN_LINES) {
    const line = [board[a], board[b], board[c]];
    const cells = [a, b, c];
    const playerCount = line.filter((x) => x === player).length;
    const emptyIdx = line.findIndex((x) => x === null);
    if (playerCount === 2 && emptyIdx !== -1) {
      return cells[emptyIdx];
    }
  }
  return -1;
}

export function getBotMove(board: Board): number {
  const empty = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);

  // 70% โอกาสเล่นแบบสุ่มสมบูรณ์
  if (Math.random() < 0.7) {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // 30% โอกาสบล็อกผู้เล่นถ้ากำลังจะชนะ
  const block = getWinningMove(board, "X");
  if (block !== -1) return block;

  // ไม่งั้นสุ่ม
  return empty[Math.floor(Math.random() * empty.length)];
}