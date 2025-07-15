import { cookies } from 'next/headers';
import { AuthUser } from './auth';

const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-key-change-in-production';

export interface SessionData {
  user: AuthUser;
  expiresAt: number;
}

export function createSessionToken(user: AuthUser): string {
  const sessionData: SessionData = {
    user,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  // Simple base64 encoding for demo - in production, use proper JWT or encryption
  return Buffer.from(JSON.stringify(sessionData)).toString('base64');
}

export function parseSessionToken(token: string): SessionData | null {
  try {
    const sessionData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (sessionData.expiresAt < Date.now()) {
      return null; // Expired
    }
    
    return sessionData;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }
  
  const sessionData = parseSessionToken(token);
  return sessionData?.user || null;
}

export async function setSession(user: AuthUser): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken(user);
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 // 24 hours
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}