# 🚀 Quick Deploy to Vercel - Checklist

Your code is already on GitHub: https://github.com/etzlertech/spoetzl-brewery-design

## ✅ Deployment Checklist

### Step 1: Deploy to Vercel (5 minutes)
- [ ] Go to https://vercel.com/new
- [ ] Sign in with GitHub
- [ ] Import `etzlertech/spoetzl-brewery-design`
- [ ] Click "Deploy" (will fail - that's OK!)

### Step 2: Create Database (2 minutes)
- [ ] In Vercel Dashboard → Your Project → Storage
- [ ] Click "Create Database" → Select "Postgres"
- [ ] Name: `spoetzl-brewery-db`
- [ ] Region: Washington D.C. (iad1)
- [ ] Click "Create"

### Step 3: Add Environment Variables (3 minutes)
Go to Settings → Environment Variables and add:

```bash
NEXTAUTH_SECRET=ufRxfUXBXlGMyTx29XzcFM1GbB9JVHv/eyZD8P+OLqw=
NEXTAUTH_URL=https://your-app-name.vercel.app
```

**Replace `your-app-name`** with your actual Vercel URL!

### Step 4: Redeploy (2 minutes)
- [ ] Go to Deployments tab
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete
- [ ] Visit your live site!

---

## 🎉 Your Site Will Be Live At:
`https://spoetzl-brewery-design.vercel.app`
(or your custom URL)

---

## 🔧 Optional: Enable File Uploads

To enable image/video uploads:

1. **In Vercel Dashboard → Storage**
   - Create "Blob" store
   - Name: `spoetzl-media`

2. **Token Auto-Added**
   - `BLOB_READ_WRITE_TOKEN` will be added automatically

3. **Redeploy**
   - File uploads will now work!

---

## 🔐 Optional: Add Google/GitHub Login

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create OAuth Client ID
3. Authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel

### GitHub OAuth
1. Go to https://github.com/settings/developers
2. New OAuth App
3. Authorization callback URL: `https://your-app.vercel.app/api/auth/callback/github`
4. Add `GITHUB_ID` and `GITHUB_SECRET` to Vercel

---

## ✅ Verify Deployment

After deployment completes:

- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Dashboard works: `https://your-app.vercel.app/dashboard`
- [ ] No console errors
- [ ] Database connected (check Vercel logs)

---

## 🆘 Troubleshooting

**Build fails with "Cannot find module @prisma/client"**
- Solution: Vercel should auto-run `prisma generate`
- Check Build logs for errors

**"Invalid NEXTAUTH_URL"**
- Make sure `NEXTAUTH_URL` matches your Vercel URL exactly
- Should be: `https://your-app-name.vercel.app` (no trailing slash)

**Database connection fails**
- Verify `POSTGRES_PRISMA_URL` is set (auto-added by Vercel Postgres)
- Check Database tab in Vercel dashboard

**Site loads but authentication doesn't work**
- Check that `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` is correct
- Clear browser cookies and try again

---

## 📊 Total Time: ~15 minutes

You're now live on Vercel! 🎉

---

## 🔗 Useful Links

- **Your GitHub Repo**: https://github.com/etzlertech/spoetzl-brewery-design
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Full Documentation**: See `DEPLOYMENT.md` for detailed guide

---

**Need help?** Check the full `DEPLOYMENT.md` file for detailed instructions.
