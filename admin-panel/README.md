# Avanticlassic Admin Panel

Secure admin dashboard for managing the Avanticlassic website content.

## 🔐 Features

- **Google OAuth Authentication** - Secure login with Fred's Google account
- **Content Management** - Manage artists, releases, and videos
- **Image Upload** - Easy image management with optimization
- **Live Publishing** - One-click updates to the main website
- **Responsive Design** - Works on desktop and mobile

## 🚀 Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (development)
   - `https://avanticlassic.vercel.app/avantiadmin/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to `.env.local`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3001/avantiadmin` and sign in with Fred's Google account.

## 🔧 Configuration

### Allowed Admin Email

Only Fred's email can access the admin panel. Update this in `.env.local`:

```env
ADMIN_EMAIL=fred@avanticlassic.com
```

### Supabase Integration

The admin panel connects to the same Supabase database as the main site:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🚀 Deployment

Deploy to Vercel:

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy

### Environment Variables for Production

```
NEXTAUTH_URL=https://admin.avanticlassic.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_SUPABASE_URL=https://cfyndmpjohwtvzljtypr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAIL=fred@avanticlassic.com
ASTRO_SITE_URL=https://avanticlassic.com
VERCEL_DEPLOY_HOOK=your-vercel-deploy-hook
```

## 📱 Usage

1. **Sign In** - Use Fred's Google account to authenticate
2. **Dashboard** - Overview of content and quick actions
3. **Manage Content** - Add/edit artists, releases, videos
4. **Upload Images** - Drag and drop image upload with optimization
5. **Publish** - One-click to update the live website

## 🔒 Security

- **Single Admin Access** - Only Fred's email can sign in
- **Google OAuth** - Secure authentication via Google
- **Protected Routes** - All admin routes require authentication
- **Session Management** - Automatic logout after inactivity

## 🛠 Tech Stack

- **Next.js 14** - React framework with App Router
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **Supabase** - Database and file storage
- **TypeScript** - Type safety
