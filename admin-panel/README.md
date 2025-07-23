# Avanticlassic Admin Panel

Secure admin dashboard for managing the Avanticlassic website content.

## 🔐 Features

- **Simple Authentication** - Secure login with username/password system
- **Content Management** - Manage artists, releases, videos, playlists, and reviews
- **Image Upload** - Easy image management with optimization
- **Two-Tier Permissions** - Company admin and Super admin roles
- **Real-time Updates** - Instant content updates to the main website
- **Responsive Design** - Works on desktop and mobile

## 🚀 Production Access

**Live Admin Panel**: https://avanticlassic-admin.vercel.app

**Super Admin Login**:
- Username: leinso@gmail.com
- Password: Naviondo123.1

## 🛠 Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` for local development.

## 🔧 Configuration

### Authentication System

The admin panel uses a simple username/password authentication system with:
- bcrypt password hashing (12 salt rounds)
- HTTP-only cookies for session management
- Role-based access control

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

## 📱 Usage

1. **Sign In** - Use admin credentials to authenticate
2. **Dashboard** - Overview of content and quick actions
3. **Manage Content** - Add/edit artists, releases, videos, playlists, reviews
4. **Upload Images** - Drag and drop image upload with optimization
5. **User Management** - Admin and Super admin role management (Super admin only)
6. **Real-time Publishing** - Changes appear instantly on the main website

## 🔒 Security

- **Role-based Access** - Company admin and Super admin permissions
- **Simple Authentication** - Secure username/password system
- **Protected Routes** - All admin routes require authentication
- **Session Management** - HTTP-only cookies with 24-hour expiration
- **Audit Logging** - Complete audit trail for all admin actions

## 🛠 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Modern styling system
- **Supabase** - PostgreSQL database and file storage
- **bcrypt** - Password hashing and security
- **@dnd-kit** - Drag and drop functionality for reordering
