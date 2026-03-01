"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Player {
  userId: string;
  name: string;
  email: string;
  image: string;
  score: number;
  wins: number;
  losses: number;
  draws: number;
  consecutiveWins: number;
  lastUpdated: string;
}

export default function LeaderboardClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setPlayers(d.players || []);
        setLoading(false);
      });
  }, []);

  const filtered = players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const getWinRate = (p: Player) => {
    const total = p.wins + p.losses + p.draws;
    if (total === 0) return "—";
    return `${Math.round((p.wins / total) * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Back to game
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-700">Leaderboard</span>
        </div>
        <span className="text-sm text-gray-500">{session?.user?.name}</span>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-gray-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider w-10">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">W</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">L</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">D</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Win%</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    No players found
                  </td>
                </tr>
              ) : (
                filtered.map((player, idx) => {
                  const isMe = player.userId === session?.user?.id;
                  return (
                    <tr
                      key={player.userId}
                      className={`border-b border-gray-50 last:border-0 ${isMe ? "bg-gray-50" : "hover:bg-gray-50"}`}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {player.image ? (
                            <Image
                              src={player.image}
                              alt="avatar"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                              {player.name[0]}
                            </div>
                          )}
                          <span className={isMe ? "font-medium text-gray-800" : "text-gray-700"}>
                            {player.name}
                            {isMe && <span className="ml-1.5 text-xs text-gray-400">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">{player.score}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{player.wins}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{player.losses}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{player.draws}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{getWinRate(player)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-gray-400 text-right">
          {filtered.length} {filtered.length === 1 ? "player" : "players"}
        </p>
      </div>
    </div>
  );
}
