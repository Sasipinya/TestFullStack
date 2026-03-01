import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LeaderboardClient from "@/components/LeaderboardClient";

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <LeaderboardClient />;
}
