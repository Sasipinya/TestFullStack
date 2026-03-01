# OX Arena — Tic-Tac-Toe

เกม Tic-Tac-Toe พัฒนาด้วย Next.js 15 + TypeScript + Tailwind CSS  
พร้อมระบบ OAuth 2.0 และระบบเก็บคะแนน

---

## วิธีติดตั้งและรัน

### 1. ตั้งค่า OAuth Providers

สร้าง credentials จากแต่ละ platform แล้วเพิ่ม Callback URL ดังนี้:

| Provider | Callback URL |
|----------|-------------|
| Google | `https://yourdomain.com/api/auth/callback/google` |
| Facebook | `https://yourdomain.com/api/auth/callback/facebook` |
| LINE | `https://yourdomain.com/api/auth/callback/line` |

- **Google**: https://console.cloud.google.com/apis/credentials
- **Facebook**: https://developers.facebook.com/apps
- **LINE**: https://developers.line.biz/console

### 2. ตั้งค่า Environment Variables

```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local`:

```env
NEXTAUTH_SECRET=<random string>
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

LINE_CLIENT_ID=
LINE_CLIENT_SECRET=

POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
```

### 3. ติดตั้ง Dependencies และรัน

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่ http://localhost:3000

---

## Features

### Authentication
- OAuth 2.0 Authorization Code Flow ผ่าน Google, Facebook, LINE
- เข้าสู่ระบบได้ก็ต่อเมื่อ authenticate สำเร็จ
- Session management ด้วย NextAuth.js

### Game
- Tic-Tac-Toe ผู้เล่น (X) vs บอท AI (O)
- บอทเล่นแบบสุ่ม มีโอกาสแพ้ได้
- แสดง winning line เมื่อจบเกม

### Score System

| ผลลัพธ์ | คะแนน |
|--------|-------|
| ชนะ | +1 pt |
| แพ้ | -1 pt |
| เสมอ | 0 pt |
| ชนะ 3 ครั้งติด | +2 pts (bonus!) |

- ชนะ 3 ครั้งติดต่อกัน → รับ bonus +1 คะแนนพิเศษ (รวมเป็น +2) แล้วนับใหม่
- แพ้หรือเสมอจะ reset consecutive win counter

### Leaderboard
- ตาราง ranking ผู้เล่นทั้งหมด
- ค้นหาผู้เล่นได้
- แสดง Win Rate, W/L/D stats

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Auth**: NextAuth.js v4 (OAuth 2.0)
- **Database**: Neon Serverless Postgres

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── game/                # Game result API
│   │   └── leaderboard/         # Leaderboard API
│   ├── leaderboard/             # Leaderboard page
│   ├── login/                   # Login page
│   └── page.tsx                 # Game page (protected)
├── auth.ts                      # NextAuth config
├── components/
│   ├── GameClient.tsx           # Game UI component
│   └── LeaderboardClient.tsx    # Leaderboard UI
├── lib/
│   ├── bot.ts                   # Bot AI + game logic
│   └── db.ts                    # Neon Postgres operations
└── types/
    └── next-auth.d.ts           # Type extensions
```

---

## Deploy บน Vercel

1. Push โปรเจกต์ขึ้น GitHub
2. Import repository ที่ https://vercel.com/new
3. ไปที่ **Storage** → สร้าง Neon Postgres database → Connect กับโปรเจกต์
4. เพิ่ม Environment Variables ที่ **Settings** → **Environment Variables**
5. Redeploy