#!/bin/bash

# Add environment variables to Vercel project
echo "Adding environment variables to Vercel..."

# Add NEXT_PUBLIC_SUPABASE_URL
echo "https://cfyndmpjohwtvzljtypr.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Add NEXT_PUBLIC_SUPABASE_ANON_KEY  
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDc3MTgsImV4cCI6MjA2NzcyMzcxOH0.0AYDyBT9ESSnVdj9weHekl1suHlrekJNYnO-zW8iL6c" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Add SUPABASE_SERVICE_ROLE_KEY
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "Environment variables added successfully!"