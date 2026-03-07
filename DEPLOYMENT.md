# Deployment Guide - Spoetzl Brewery Design System

This guide walks you through deploying the application to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database** - PostgreSQL database (we'll set this up)

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done)
   ```bash
   cd "Spoetzl Brewery Landscape Design system/spoetzl-brewery-app"
   git init
   git add .
   git commit -m "Initial commit: Spoetzl Brewery Design System"
   ```

2. **Create GitHub Repository**
   - Go to [github.com/new](https://github.com/new)
   - Create a new repository named `spoetzl-brewery-design`
   - Don't initialize with README (you already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/spoetzl-brewery-design.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Set Up Vercel Project

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"

2. **Import Repository**
   - Select "Import Git Repository"
   - Choose your `spoetzl-brewery-design` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or leave blank)
   - **Build Command**: `npm run build` (already configured)
   - **Output Directory**: `.next` (auto-detected)
   - Click "Deploy" (it will fail first time - that's expected)

## Step 3: Set Up Database

### Option A: Vercel Postgres (Recommended - Easiest)

1. **Create Database**
   - In your Vercel project dashboard
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a region close to your users
   - Click "Create"

2. **Connect Database**
   - Vercel will automatically add `POSTGRES_*` environment variables
   - The `DATABASE_URL` will be automatically set

### Option B: External PostgreSQL (Supabase, Railway, Neon, etc.)

**Supabase (Free Tier Available)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the "Connection string" (URI format)
5. Add to Vercel environment variables

**Railway (Free Tier Available)**
1. Go to [railway.app](https://railway.app)
2. Create new project → Provision PostgreSQL
3. Copy the `DATABASE_URL` from variables tab
4. Add to Vercel environment variables

**Neon (Free Tier Available)**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables

## Step 4: Configure Environment Variables

1. **Go to Project Settings**
   - In Vercel dashboard → Your Project → Settings → Environment Variables

2. **Add Required Variables**

   ```bash
   # Database (if using external provider)
   DATABASE_URL=postgresql://user:password@host:5432/database

   # NextAuth
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   GITHUB_ID=your-github-id
   GITHUB_SECRET=your-github-secret

   # Vercel Blob (Optional - for file uploads)
   BLOB_READ_WRITE_TOKEN=vercel-blob-token
   ```

3. **Generate NEXTAUTH_SECRET**
   ```bash
   # On your local machine
   openssl rand -base64 32
   ```
   Copy the output and paste as `NEXTAUTH_SECRET`

4. **Set Environment for all environments**
   - Production: ✅
   - Preview: ✅
   - Development: ✅ (optional)

## Step 5: Run Database Migrations

1. **Option A: From Vercel Dashboard**
   - After adding DATABASE_URL
   - Trigger a new deployment
   - The build process will run `prisma generate`

2. **Option B: Locally (Recommended for first time)**
   ```bash
   # Update your local .env with production DATABASE_URL
   npx prisma db push

   # Or run migrations
   npx prisma migrate deploy
   ```

## Step 6: Deploy

1. **Trigger Deployment**
   - In Vercel dashboard → Deployments
   - Click "Redeploy"
   - Or push a new commit to GitHub (auto-deploys)

2. **Wait for Build**
   - Monitor build logs
   - Should complete in 2-3 minutes

3. **Visit Your Site**
   - Your app will be at `https://your-app.vercel.app`

## Step 7: Set Up OAuth (Optional)

### Google OAuth

1. **Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project or select existing
   - Go to "APIs & Services" → "Credentials"
   - Create "OAuth 2.0 Client ID"

2. **Configure OAuth Consent Screen**
   - Add app name, user support email
   - Add authorized domains: `vercel.app`

3. **Create Credentials**
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://your-app.vercel.app/api/auth/callback/google
     ```
   - Copy Client ID and Client Secret
   - Add to Vercel environment variables

### GitHub OAuth

1. **GitHub Settings**
   - Go to Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"

2. **Register Application**
   - Application name: Spoetzl Brewery Design
   - Homepage URL: `https://your-app.vercel.app`
   - Authorization callback URL:
     ```
     https://your-app.vercel.app/api/auth/callback/github
     ```

3. **Get Credentials**
   - Copy Client ID
   - Generate new client secret
   - Add to Vercel environment variables

## Step 8: Set Up Vercel Blob Storage (Optional)

For file uploads (images, videos, PDFs):

1. **Create Blob Store**
   - Vercel Dashboard → Storage → Create Database
   - Select "Blob"
   - Name it (e.g., "spoetzl-media")

2. **Get Token**
   - Vercel will auto-create `BLOB_READ_WRITE_TOKEN`
   - Verify it's set in environment variables

## Step 9: Verify Deployment

1. **Check Homepage**
   - Visit `https://your-app.vercel.app`
   - Should see landing page

2. **Test Authentication**
   - Click "Sign In"
   - Try OAuth providers
   - Should redirect properly

3. **Test Database**
   - After signing in
   - User should be created in database
   - Check in Prisma Studio or database dashboard

## Step 10: Custom Domain (Optional)

1. **Add Domain**
   - Vercel Dashboard → Settings → Domains
   - Add your custom domain

2. **Configure DNS**
   - Follow Vercel's instructions
   - Usually add A record or CNAME

3. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your custom domain
   - Redeploy

## Troubleshooting

### Build Fails

**Error: Cannot find module '@prisma/client'**
```bash
# Solution: Make sure postinstall script runs
npm run postinstall
```

**Error: Database connection failed**
```bash
# Solution: Check DATABASE_URL format
# Should be: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Authentication Issues

**Error: Invalid redirect URI**
```bash
# Solution: Check OAuth redirect URIs match exactly
# Should be: https://your-app.vercel.app/api/auth/callback/[provider]
```

**Error: NEXTAUTH_SECRET missing**
```bash
# Solution: Generate and add NEXTAUTH_SECRET
openssl rand -base64 32
```

### Runtime Errors

**Error: Prisma Client not generated**
```bash
# Solution: Trigger new deployment
# postinstall script should run automatically
```

## Monitoring & Maintenance

1. **View Logs**
   - Vercel Dashboard → Deployments → View Function Logs
   - Real-time error tracking

2. **Analytics**
   - Enable Vercel Analytics
   - Monitor traffic and performance

3. **Database Backups**
   - Vercel Postgres: Automatic backups
   - External: Configure backup schedules

## Production Checklist

- [ ] Database is set up and migrations run
- [ ] All environment variables configured
- [ ] NEXTAUTH_SECRET is set (secure random string)
- [ ] OAuth providers configured (if using)
- [ ] Vercel Blob configured (if using file uploads)
- [ ] Custom domain configured (optional)
- [ ] Site loads without errors
- [ ] Authentication works
- [ ] Database operations work
- [ ] File uploads work (if enabled)

## Useful Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push       # Push schema changes
npm run db:studio     # Open Prisma Studio
npm run db:migrate    # Create migration
npm run db:deploy     # Deploy migrations

# View production logs
vercel logs

# Deploy from CLI
vercel --prod
```

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **NextAuth Docs**: [next-auth.js.org](https://next-auth.js.org)

---

**Ready to Deploy!** 🚀

Your Spoetzl Brewery Design System is ready for production.
