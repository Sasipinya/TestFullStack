import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "OX ARENA — Tic-Tac-Toe",
  description: "Tic-Tac-Toe with Sasipinya C. and score system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <Providers>
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}