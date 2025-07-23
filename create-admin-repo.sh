#!/bin/bash

# Create new admin repository directory
ADMIN_REPO_DIR="../avanticlassic-admin"
ADMIN_SOURCE_DIR="admin-panel/admin-panel"

echo "Creating new admin repository at $ADMIN_REPO_DIR"

# Remove existing directory if it exists
rm -rf "$ADMIN_REPO_DIR"

# Create new directory
mkdir -p "$ADMIN_REPO_DIR"

# Copy all admin panel files (including the main package.json and config files from admin-panel/)
echo "Copying admin panel source files..."
cp -r "$ADMIN_SOURCE_DIR"/* "$ADMIN_REPO_DIR/"

# Copy additional admin panel files from parent directory
cp admin-panel/README.md "$ADMIN_REPO_DIR/" 2>/dev/null || echo "No README.md found"
cp admin-panel/package.json "$ADMIN_REPO_DIR/" 2>/dev/null || echo "Using existing package.json"
cp admin-panel/tsconfig.json "$ADMIN_REPO_DIR/" 2>/dev/null || echo "Using existing tsconfig.json"
cp admin-panel/next.config.ts "$ADMIN_REPO_DIR/" 2>/dev/null || echo "Using existing next.config.ts"
cp admin-panel/postcss.config.mjs "$ADMIN_REPO_DIR/" 2>/dev/null || echo "Using existing postcss.config.mjs"
cp admin-panel/eslint.config.mjs "$ADMIN_REPO_DIR/" 2>/dev/null || echo "Using existing eslint.config.mjs"

# Copy supabase migrations for database schema
echo "Copying database migrations..."
cp -r admin-panel/supabase "$ADMIN_REPO_DIR/" 2>/dev/null || echo "No supabase directory found"

# Create a new README for the admin repository
cat > "$ADMIN_REPO_DIR/README.md" << 'EOF'
# Avanti Classic Admin Panel

Admin CMS for the Avanti Classic website with two-tier architecture.

## Features

- **Two-Tier Admin Architecture**: Company Admins + Super Admins
- **Role-Based Access Control**: Restricted access to system settings  
- **Complete Content Management**: Artists, Releases, Videos, Playlists, Reviews, Distributors
- **User Management**: Super admins can manage company admin accounts
- **Audit Logging**: Complete tracking of administrative actions
- **Google OAuth**: Secure authentication with Auth.js v5

## Technology Stack

- **Framework**: Next.js 15 + TypeScript
- **Authentication**: Auth.js v5 (NextAuth v5) with Google OAuth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Development

```bash
npm install
npm run dev
```

## Production URLs

- **Main Site**: https://avanticlassic.vercel.app
- **Admin Panel**: https://avanticlassic-admin-qp2uem9ho-carlos-2227s-projects.vercel.app

## Environment Variables

Required for deployment:

```
NEXTAUTH_URL=https://your-admin-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## User Roles

### Company Admins (Content Managers)
- Artists, Releases, Videos, Playlists, Reviews, Distributors management
- **Restricted from**: System settings, user management

### Super Admins (Technical Team)  
- Full system access
- User management and account creation
- System settings and configuration

## Database Schema

See `/supabase/migrations/` for complete database schema including:
- Content management tables
- User roles and permissions
- Audit logging system
EOF

# Create .gitignore
cat > "$ADMIN_REPO_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
.env

# Vercel
.vercel/

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache
EOF

echo "Admin repository created successfully at $ADMIN_REPO_DIR"
echo "Contents:"
ls -la "$ADMIN_REPO_DIR"