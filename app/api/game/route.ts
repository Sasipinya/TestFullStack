import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { recordGameResult, getPlayer } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "No user ID" }, { status: 401 });

  const { result } = await req.json();
  if (!["win", "loss", "draw"].includes(result)) {
    return NextResponse.json({ error: "Invalid result" }, { status: 400 });
  }

  const data = await recordGameResult(userId, result);
  return NextResponse.json(data);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "No user ID" }, { status: 401 });

  const player = await getPlayer(userId);
  return NextResponse.json({ player });
}