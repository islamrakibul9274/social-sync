# File Structure of social-sync

This document outlines the structure of the `social-sync` project.

```
.
├── .DS_Store
├── .env
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
├── tsconfig.json
├── .git/
├── .next/
├── node_modules/
├── prisma/
│   └── schema.prisma
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── src/
    ├── .DS_Store
    ├── auth.ts
    ├── app/
    │   ├── .DS_Store
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── api/
    │   │   ├── .DS_Store
    │   │   └── auth/
    │   ├── auth/
    │   │   ├── .DS_Store
    │   │   ├── signin/
    │   │   └── signup/
    │   └── feed/
    │       └── page.tsx
    ├── components/
    │   └── PostForm.tsx
    └── lib/
        └── actions.ts
```
