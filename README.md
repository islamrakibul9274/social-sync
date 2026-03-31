# ⚡ SocialSync

> **Connect in the Future. Today.** ### 🌐 [Live Demo: View SocialSync](https://social-sync-skic-ivbjsigly-rumel9274-6063s-projects.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

## ✨ Core Features

* **🏎️ Optimistic UI:** Instantaneous feed updates using React's `useOptimistic` hook—zero latency feeling for the user.
* **🔒 Secure Server Actions:** Direct-to-server data mutations and secure API key handling (no client-side exposure).
* **📸 Server-Side Image Uploads:** Seamless profile picture uploads routed securely through the Next.js server to the ImgBB API.
* **💅 Cyber-Mesh Glassmorphism:** A highly responsive, animated UI powered by Tailwind CSS and Framer Motion.
* **🛡️ Type-Safe Architecture:** End-to-end type safety from the Prisma database schema to the frontend React components.
* **🔑 Custom Authentication:** Secure credentials login system powered by NextAuth.js.
* **⚡ Full CRUD Functionality:** Create, read, update, and delete posts, comments, and profile data.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [MongoDB](https://www.mongodb.com/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Image Hosting:** [ImgBB API](https://api.imgbb.com/)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/social-sync.git](https://github.com/YOUR_USERNAME/social-sync.git)
cd social-sync
```



### 2\. Install dependencies

```bash
npm install
```

### 3\. Setup Environment Variables

Create a `.env` file in the root of your project and add the following credentials:

```env
# MongoDB Connection String
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/socialsync"

# NextAuth Secret (Generate one using: openssl rand -base64 32)
AUTH_SECRET="your_generated_secret_here"

# NextAuth URL (for local development)
NEXTAUTH_URL="http://localhost:3000"

# ImgBB API Key for Image Uploads
IMGBB_API_KEY="your_imgbb_api_key_here"
```

### 4\. Initialize Prisma

Generate the Prisma client to sync with your database:

```bash
npx prisma generate
```

### 5\. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 📦 Deployment

This project is heavily optimized for deployment on [Vercel](https://vercel.com/).

Ensure you configure the `Build Command` in Vercel to:

```bash
prisma generate && next build
```

And don't forget to add your Environment Variables in the Vercel dashboard (without quotation marks).

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

