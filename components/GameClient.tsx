"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Board, checkWinner, getBotMove } from "@/lib/bot";
import Image from "next/image";

interface PlayerStats {
  score: number;
  wins: number;
  losses: number;
  draws: number;
  consecutiveWins: number;
}

type GameStatus = "idle" | "playing" | "win" | "loss" | "draw";

export default function GameClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ scoreChange: number; bonusAwarded: boolean } | null>(null);
  const [botThinking, setBotThinking] = useState(false);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/game");
    const data = await res.json();
    if (data.player) setStats(data.player);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setGameStatus("playing");
    setWinLine(null);
    setLastResult(null);
  };

  const handleCellClick = async (index: number) => {
    if (board[index] || gameStatus !== "playing" || isProcessing || botThinking) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const { winner, line } = checkWinner(newBoard);
    if (winner === "X") {
      setWinLine(line);
      setGameStatus("win");
      await submitResult("win");
      return;
    }
    if (winner === "draw") {
      setGameStatus("draw");
      await submitResult("draw");
      return;
    }

    setBotThinking(true);
    setTimeout(async () => {
      const botMove = getBotMove(newBoard);
      const afterBot = [...newBoard];
      afterBot[botMove] = "O";
      setBoard(afterBot);
      setBotThinking(false);

      const { winner: w2, line: l2 } = checkWinner(afterBot);
      if (w2 === "O") {
        setWinLine(l2);
        setGameStatus("loss");
        await submitResult("loss");
      } else if (w2 === "draw") {
        setGameStatus("draw");
        await submitResult("draw");
      }
    }, 500);
  };

  const submitResult = async (result: "win" | "loss" | "draw") => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      const data = await res.json();
      if (data.player) {
        setStats(data.player);
        setLastResult({ scoreChange: data.scoreChange, bonusAwarded: data.bonusAwarded });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const statusText: Record<GameStatus, string> = {
    idle: "Press Start to play",
    playing: botThinking ? "Bot is thinking..." : "Your turn",
    win: "You won",
    loss: "You lost",
    draw: "Draw",
  };

  const statusColor: Record<GameStatus, string> = {
    idle: "#666",
    playing: botThinking ? "#888" : "#111",
    win: "#2d7a2d",
    loss: "#cc3333",
    draw: "#666",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">OX Arena</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/leaderboard")}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Leaderboard
          </button>
          <div className="flex items-center gap-2">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-gray-600">{session?.user?.name}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-start justify-center pt-12 px-6">
        <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Stats */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Your Stats</p>
              {stats ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500">Score</span>
                    <span className="text-2xl font-semibold text-gray-800">{stats.score}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-medium" style={{ color: "#2d7a2d" }}>{stats.wins}</div>
                      <div className="text-xs text-gray-400">Win</div>
                    </div>
                    <div>
                      <div className="text-lg font-medium" style={{ color: "#cc3333" }}>{stats.losses}</div>
                      <div className="text-xs text-gray-400">Loss</div>
                    </div>
                    <div>
                      <div className="text-lg font-medium text-gray-600">{stats.draws}</div>
                      <div className="text-xs text-gray-400">Draw</div>
                    </div>
                  </div>
                  {stats.consecutiveWins > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Win streak</span>
                        <span className="font-medium text-gray-800">{stats.consecutiveWins} / 3</span>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full"
                            style={{
                              backgroundColor: i < stats.consecutiveWins ? "#111" : "#e5e7eb",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {3 - stats.consecutiveWins} more for +1 bonus
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Loading...</p>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Scoring</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Win</span>
                  <span className="font-medium text-gray-800">+1 pt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Loss</span>
                  <span className="font-medium text-gray-800">-1 pt</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Draw</span>
                  <span className="font-medium text-gray-800">0 pt</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="text-gray-500">3-win streak</span>
                  <span className="font-medium text-gray-800">+2 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Board */}
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p
                className="text-sm font-medium"
                style={{ color: statusColor[gameStatus] }}
              >
                {statusText[gameStatus]}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {board.map((cell, i) => (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={!!cell || gameStatus !== "playing" || botThinking}
                  className={`w-24 h-24 rounded border text-4xl font-light flex items-center justify-center ${
                    !cell && gameStatus === "playing" && !botThinking
                      ? "cursor-pointer hover:bg-gray-50"
                      : "cursor-default"
                  } ${winLine?.includes(i) ? "win-cell" : "bg-white border-gray-200"}`}
                >
                  {cell === "X" && (
                    <span style={{ color: "#cc3333" }}>X</span>
                  )}
                  {cell === "O" && (
                    <span style={{ color: "#1a56db" }}>O</span>
                  )}
                </button>
              ))}
            </div>

            {lastResult && gameStatus !== "playing" && (
              <div
                className="rounded-md px-4 py-3 text-sm text-center w-full max-w-xs border"
                style={{
                  backgroundColor:
                    gameStatus === "win" ? "#f0f7f0" :
                    gameStatus === "loss" ? "#fdf2f2" : "#f5f5f5",
                  borderColor:
                    gameStatus === "win" ? "#c3e6c3" :
                    gameStatus === "loss" ? "#f5c6c6" : "#e5e7eb",
                }}
              >
                {lastResult.bonusAwarded && (
                  <p className="text-xs text-gray-500 mb-1">Streak bonus applied</p>
                )}
                <p className="font-medium text-gray-800">
                  {lastResult.scoreChange > 0
                    ? `+${lastResult.scoreChange} point${lastResult.scoreChange !== 1 ? "s" : ""}`
                    : lastResult.scoreChange < 0
                    ? `${lastResult.scoreChange} point`
                    : "No points"}
                </p>
              </div>
            )}

            {gameStatus !== "playing" && (
              <button
                onClick={startGame}
                className="px-6 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-700"
              >
                {gameStatus === "idle" ? "Start" : "Play again"}
              </button>
            )}
          </div>

          {/* Opponent */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Opponent</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-light text-gray-400">
                  BOT
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Bot</p>
                  <p className="text-xs text-gray-400">Minimax algorithm</p>
                </div>
              </div>
              {botThinking && (
                <p className="text-xs text-gray-400 mt-3">Thinking...</p>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Legend</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-light" style={{ color: "#cc3333" }}>X</span>
                  <span className="text-gray-500">You (Player)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-light" style={{ color: "#1a56db" }}>O</span>
                  <span className="text-gray-500">Bot (BOT)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
