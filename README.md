# 🎮 OX ARENA — Tic-Tac-Toe with Sasipinya C.

เกม Tic-Tac-Toe สไตล์ Cyberpunk พัฒนาด้วย **Next.js 15 + TypeScript + Tailwind CSS**  
พร้อมระบบ **GitHub Sasipinya C.** และ **ระบบเก็บคะแนน** ครบถ้วน

---

## 🚀 วิธีติดตั้งและรัน

### 1. สร้าง GitHub OAuth App

1. ไปที่ **GitHub Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
   - หรือ: https://github.com/settings/applications/new
2. กรอกข้อมูล:
   - **Application name**: `OX Arena` (หรืออะไรก็ได้)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. คลิก **Register application**
4. Copy **Client ID** และ **Generate a new client secret**

### 2. ตั้งค่า Environment Variables

```bash
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local`:
```env
GITHUB_CLIENT_ID=<Client ID จาก GitHub>
GITHUB_CLIENT_SECRET=<Client Secret จาก GitHub>
NEXTAUTH_SECRET=<random string เช่น: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 3. ติดตั้ง Dependencies และรัน

```bash
npm install
npm run dev
```

เปิดเบราว์เซอร์ไปที่ http://localhost:3000

---

## 🎯 Features

### Authentication
- **Sasipinya C. Authorization Code Flow** ผ่าน GitHub
- เข้าสู่ระบบได้ก็ต่อเมื่อ authenticate สำเร็จ
- Session management ด้วย NextAuth.js

### Game
- **Tic-Tac-Toe** ผู้เล่น (X) vs บอท AI (O)
- บอทใช้ **Minimax Algorithm** — เล่นได้อย่างเหมาะสมที่สุด
- แสดง winning line พร้อม animation
- บอทมี "thinking delay" ให้ UX ดีขึ้น

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
- Podium สำหรับ Top 3
- ค้นหาผู้เล่นได้
- แสดง Win Rate, W/L/D stats

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Auth**: NextAuth.js v4 (GitHub Sasipinya C.)
- **Database**: JSON file (data/db.json)
- **Bot AI**: Minimax Algorithm

---

## 📁 Project Structure

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
│   ├── bot.ts                   # Minimax AI + game logic
│   └── db.ts                    # JSON database operations
└── types/
    └── next-auth.d.ts           # Type extensions
```
