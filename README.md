# Spoetzl Brewery Landscape Design System

A modern, full-stack web application for collaborative landscape design planning, built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 App Router, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **File Storage**: Vercel Blob Storage for images, videos, and documents
- **Real-time Collaboration**: Comment system and team features
- **Responsive Design**: Mobile-first, fully responsive UI

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **File Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Deployment**: [Vercel](https://vercel.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual values:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

3. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations (create database tables)
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

## 🌐 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Set up Database**
   - Use Vercel Postgres (recommended) or external provider
   - Update `DATABASE_URL` in Vercel environment variables

4. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

## 🗄️ Database Schema

Main models:
- **User**: Authentication and user management
- **Image**: Photo gallery with categorization
- **Video**: Video library (uploads and links)
- **Map**: Site plans and layouts
- **Plan**: Project planning documents
- **Enhancement**: Proposed brewery enhancements
- **Specification**: Technical design specifications
- **Comment**: Commenting system for all content types

## 📄 License

© 2024 Evergold Landscaping. All rights reserved.

---

**Managed by Evergold Landscaping**
