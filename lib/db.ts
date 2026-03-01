import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

interface PlayerRecord {
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

interface GameLog {
  id: string;
  userId: string;
  result: "win" | "loss" | "draw";
  scoreChange: number;
  bonusAwarded: boolean;
  createdAt: string;
}

interface DB {
  players: PlayerRecord[];
  gameLogs: GameLog[];
}

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ players: [], gameLogs: [] }));
}

function readDB(): DB {
  ensureDataDir();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(db: DB) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getOrCreatePlayer(userId: string, name: string, email: string, image: string): PlayerRecord {
  const db = readDB();
  let player = db.players.find((p) => p.userId === userId);
  if (!player) {
    player = {
      userId,
      name,
      email,
      image,
      score: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      consecutiveWins: 0,
      lastUpdated: new Date().toISOString(),
    };
    db.players.push(player);
    writeDB(db);
  } else {
    // Update profile info
    player.name = name;
    player.email = email;
    player.image = image;
    writeDB(db);
  }
  return player;
}

export function getPlayer(userId: string): PlayerRecord | null {
  const db = readDB();
  return db.players.find((p) => p.userId === userId) || null;
}

export function recordGameResult(
  userId: string,
  result: "win" | "loss" | "draw"
): { player: PlayerRecord; bonusAwarded: boolean; scoreChange: number } {
  const db = readDB();
  const player = db.players.find((p) => p.userId === userId);
  if (!player) throw new Error("Player not found");

  let scoreChange = 0;
  let bonusAwarded = false;

  if (result === "win") {
    scoreChange = 1;
    player.wins += 1;
    player.consecutiveWins += 1;
    if (player.consecutiveWins >= 3) {
      scoreChange += 1; // bonus point
      bonusAwarded = true;
      player.consecutiveWins = 0; // reset
    }
  } else if (result === "loss") {
    scoreChange = -1;
    player.losses += 1;
    player.consecutiveWins = 0;
  } else {
    player.draws += 1;
    player.consecutiveWins = 0;
  }

  player.score += scoreChange;
  player.lastUpdated = new Date().toISOString();

  // Log game
  const log: GameLog = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    result,
    scoreChange,
    bonusAwarded,
    createdAt: new Date().toISOString(),
  };
  db.gameLogs.push(log);

  writeDB(db);
  return { player, bonusAwarded, scoreChange };
}

export function getAllPlayers(): PlayerRecord[] {
  const db = readDB();
  return db.players.sort((a, b) => b.score - a.score);
}

export function getRecentLogs(userId: string, limit = 10): GameLog[] {
  const db = readDB();
  return db.gameLogs
    .filter((l) => l.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
