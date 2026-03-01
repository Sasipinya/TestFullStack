import { neon } from "@neondatabase/serverless";

function getSQL() {
  const url = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL!;
  return neon(url);
}

export async function initDB() {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS players (
      user_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      image TEXT,
      score INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      draws INTEGER DEFAULT 0,
      consecutive_wins INTEGER DEFAULT 0,
      last_updated TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function getOrCreatePlayer(
  userId: string,
  name: string,
  email: string,
  image: string
) {
  const sql = getSQL();
  await initDB();
  await sql`
    INSERT INTO players (user_id, name, email, image)
    VALUES (${userId}, ${name}, ${email}, ${image})
    ON CONFLICT (user_id) DO UPDATE
    SET name = ${name}, email = ${email}, image = ${image}, last_updated = NOW()
  `;
}

export async function getPlayer(userId: string) {
  const sql = getSQL();
  await initDB();
  const rows = await sql`
    SELECT * FROM players WHERE user_id = ${userId}
  `;
  if (!rows[0]) return null;
  return toPlayer(rows[0]);
}

export async function recordGameResult(
  userId: string,
  result: "win" | "loss" | "draw"
) {
  const sql = getSQL();
  await initDB();
  const rows = await sql`
    SELECT * FROM players WHERE user_id = ${userId}
  `;
  const player = rows[0];
  if (!player) throw new Error("Player not found");

  let scoreChange = 0;
  let bonusAwarded = false;
  let newConsecutiveWins = player.consecutive_wins as number;

  if (result === "win") {
    scoreChange = 1;
    newConsecutiveWins += 1;
    if (newConsecutiveWins >= 3) {
      scoreChange += 1;
      bonusAwarded = true;
      newConsecutiveWins = 0;
    }
  } else if (result === "loss") {
    scoreChange = -1;
    newConsecutiveWins = 0;
  } else {
    newConsecutiveWins = 0;
  }

  const updated = await sql`
    UPDATE players SET
      score = score + ${scoreChange},
      wins = wins + ${result === "win" ? 1 : 0},
      losses = losses + ${result === "loss" ? 1 : 0},
      draws = draws + ${result === "draw" ? 1 : 0},
      consecutive_wins = ${newConsecutiveWins},
      last_updated = NOW()
    WHERE user_id = ${userId}
    RETURNING *
  `;

  return { player: toPlayer(updated[0]), bonusAwarded, scoreChange };
}

export async function getAllPlayers() {
  const sql = getSQL();
  await initDB();
  const rows = await sql`
    SELECT * FROM players ORDER BY score DESC
  `;
  return rows.map(toPlayer);
}

function toPlayer(row: Record<string, unknown>) {
  return {
    userId: row.user_id as string,
    name: row.name as string,
    email: row.email as string,
    image: row.image as string,
    score: row.score as number,
    wins: row.wins as number,
    losses: row.losses as number,
    draws: row.draws as number,
    consecutiveWins: row.consecutive_wins as number,
    lastUpdated: row.last_updated as string,
  };
}