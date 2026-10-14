# ⚡ SocialSync

> **The Real-Time Social Layer for Modern Engineers & Creators.**
> Built with Next.js 16 Turbopack, React 19, MongoDB, and Prisma ORM. Engineered with 1px precision tactile brutalism and zero-gradient minimalism.

### 🌐 Live Production Deployment: [https://social-sync-sigma.vercel.app](https://social-sync-sigma.vercel.app)

[![Live Deploy](https://img.shields.io/badge/Deploy-Vercel_Production-black?style=for-the-badge&logo=vercel&logoColor=white)](https://social-sync-sigma.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma_6-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth_v5-purple?style=for-the-badge&logo=auth0&logoColor=white)](https://next-auth.js.org/)

---

## ⚡ Key Capabilities

### 1. 📡 High-Density Pulse Stream (`/feed`)
* **Multimodal Broadcasts:** Share text, code thoughts, and high-resolution media attachments via ImgBB CDN.
* **Hashtag Indexing:** Filter stream dynamically by tags (`#tech`, `#design`, `#ai`, `#dev`, `#crypto`).
* **Optimistic Reaction Engine:** Interactive reaction chips (`❤️`, `⚡`, `🔥`, `👍`, `😢`) with sub-10ms optimistic client updates.
* **Feed Modes:** Switch seamlessly between "For You" (global stream) and "Following" (subscribed network).
* **Direct Content Controls:** Pin, bookmark, or delete pulses directly from the stream.

### 2. 💬 Direct Peer Dialogues (`/messages`)
* **Dedicated 1-on-1 Chat Hub:** Private conversation threads with real-time active polling.
* **Unread Tracking & Receipts:** Live unread count badges and delivery status checkmarks (`✓✓`).
* **Media in Chat:** Send screenshots, mockups, and images directly within conversation bubbles.
* **Frictionless Chat Triggers:** Start a dialogue instantly from any pulse or user profile with one click.
* **Member Directory:** Instant search modal across all registered network members.

### 3. 📊 Creator & Pulse Dashboard (`/dashboard`)
* **Telemetry Command Center:** Track total pulses, reaction breakdown metrics, discussion comments, and network subscriber count.
* **7-Day Velocity Chart:** Visual bar diagram measuring daily broadcasting activity and pulse cadence.
* **Quick Dispatch Studio:** In-dashboard composer to draft and publish pulses with media and hashtags.
* **Content Management:** Tabbed control center for "My Pulses", "Saved Bookmarks", and "Audience Activity".

### 4. 👤 Creator Profile & Social Graph (`/user/[id]`)
* **Custom Profiles:** Cover banner, headline/role, biography, and social links (GitHub, Twitter/X, Website).
* **Follow Graph:** Follow and unfollow creators with instant subscriber counter updates.
* **Saved Bookmarks (`/bookmarks`):** Dedicated library of saved pulses for quick reference.

### 5. 🎨 2026 Linear-Style Engineered UI
* **Tactile Brutalism & Technical Typography:** Replaced dated gradient blobs with 1px structural borders (`border-zinc-800`), technical coordinate dot/grid canvas (`tech-grid`), matte dark surfaces (`#050507`), and keycap indicators (`kbd`).
* **Engineered Full-Width Header:** 14px sticky navigation bar featuring minimalist monochrome branding, `v2.6.0` version indicator, and real-time operational status.
* **Interactive Sandbox Terminal:** Live component playground on the landing page testing emoji physics, simulated chat, and cluster telemetry.

---

## 🛠️ Architecture & Tech Stack

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth handlers & registration endpoints
│   │   └── chat/           # Live message polling endpoint
│   ├── auth/
│   │   ├── signin/         # Engineered credentials login
│   │   └── signup/         # Account initialization
│   ├── bookmarks/          # Saved pulses hub
│   ├── dashboard/          # Creator telemetry & content manager
│   ├── feed/               # Main 3-column pulse stream
│   ├── messages/           # Direct 1-on-1 dialogues hub
│   ├── user/[id]/          # Creator profile & follow graph
│   ├── globals.css         # Linear-style 1px tokens & tech grid
│   └── page.tsx            # Technical landing page & live simulator
├── components/
│   ├── chat/               # ChatContainer, conversation list & thread
│   ├── dashboard/          # DashboardView & 7-day velocity chart
│   ├── profile/            # ProfileHeader & social links
│   ├── AppShell.tsx        # 3-column responsive navigation shell
│   ├── LandingUI.tsx       # Landing page showcase & terminal sandbox
│   ├── PostCard.tsx        # 1px engineered pulse card
│   ├── PostForm.tsx        # Multimodal pulse composer
│   ├── ReactionButtons.tsx # Optimistic reaction chips
│   └── CommentSection.tsx  # Dialogue comments drawer
├── lib/
│   ├── actions.ts          # Server Actions (Posts, Chat, Follows, Bookmarks)
│   ├── data.ts             # Cached Prisma MongoDB database queries
│   └── db.ts               # Global Prisma client singleton
└── prisma/
    └── schema.prisma       # MongoDB ODM schema (User, Post, Reaction, Conversation, Message, Follow, Bookmark)
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/islamrakibul9274/social-sync.git
cd social-sync
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create `.env` and `.env.local` files in the project root:

```env
# MongoDB Connection String (Atlas / Clustered)
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/socialsync"

# NextAuth Secret
AUTH_SECRET="your_generated_secret_here"

# ImgBB API Key for CDN media uploads
IMGBB_API_KEY="your_imgbb_api_key_here"
```

### 4. Synchronize Database & Generate Client
```bash
npx prisma db push
npx prisma generate
```

### 5. Launch the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Production Build & Deployment

To verify the production build:
```bash
npm run build
```

This project is optimized for deployment on **Vercel**:
* **Framework Preset:** Next.js
* **Build Command:** `prisma generate && next build`
* **Output Directory:** Next.js default (`.next`)
* **Environment Variables:** Configure `DATABASE_URL`, `AUTH_SECRET`, and `IMGBB_API_KEY` in your Vercel Project Settings.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
