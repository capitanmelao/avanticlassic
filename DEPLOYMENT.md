# Deployment Guide

Quick setup guide for deploying Avanticlassic to Vercel with Supabase.

## 🚀 Step 1: GitHub Repository

1. **Update the git remote** (replace with your actual repository URL):
```bash
git remote set-url origin https://github.com/yourusername/avanticlassic.git
# OR if you haven't added it yet:
git remote add origin https://github.com/yourusername/avanticlassic.git
```

2. **Push to GitHub**:
```bash
git push -u origin main
```

## 📦 Step 2: Vercel Deployment

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Choose "Astro" as the framework (should be detected automatically)

2. **Environment Variables**:
   Add these in the Vercel dashboard:
   ```
   SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDc3MTgsImV4cCI6MjA2NzcyMzcxOH0.0AYDyBT9ESSnVdj9weHekl1suHlrekJNYnO-zW8iL6c
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM
   SITE_URL=https://your-project.vercel.app
   ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your site
   - Update `SITE_URL` with your actual Vercel domain

## 🗄️ Step 3: Supabase Database Setup

1. **Execute Database Schema**:
   - Go to your Supabase dashboard: https://cfyndmpjohwtvzljtypr.supabase.co
   - Navigate to "SQL Editor"
   - Copy and paste the contents of `supabase/schema.sql`
   - Click "Run" to create all tables and policies

2. **Create Storage Buckets**:
   - Go to "Storage" in Supabase dashboard
   - Create these buckets:
     - `artist-images` (public)
     - `release-images` (public)
     - `admin-uploads` (private)

3. **Create Admin User** (optional - for Phase 2 CMS):
   ```sql
   INSERT INTO public.admin_users (email, password_hash) 
   VALUES ('admin@avanticlassic.com', 'temporary_hash');
   ```

## ✅ Step 4: Verify Deployment

1. **Check your site**: Your Vercel URL should show the working site
2. **Test all languages**: `/en/`, `/fr/`, `/de/`
3. **Test all sections**: Artists, Releases, Videos, About
4. **Mobile responsive**: Check on mobile devices

## 🔮 Next Steps: Phase 2 CMS

Once the site is deployed, we'll build:
1. **Admin authentication** with 2FA
2. **Content management interface** 
3. **Image upload system**
4. **Automated publishing workflow**

## 🚨 Security Notes

- Never commit `.env` files to Git
- The service role key should only be used server-side
- Enable 2FA on your Vercel and Supabase accounts
- Monitor your Supabase usage and set up billing alerts

## 📞 Support

If you encounter any issues:
1. Check Vercel deployment logs
2. Check Supabase logs and database connections
3. Verify all environment variables are set correctly
4. Test locally first with `npm run build && npm run preview`