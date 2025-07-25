import bcrypt from 'bcryptjs';

// Admin user credentials
const ADMIN_USER = {
  email: 'leinso@gmail.com',
  // Hash of "Naviondo123.1"
  passwordHash: '$2b$12$9d.rJdl/aCbONM0pmInlye/A9ZXGZDGi.czRe/Oe/3RdSm5KKwhjS',
  role: 'super_admin',
  name: 'Admin User'
};

export interface AuthUser {
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  if (email !== ADMIN_USER.email) {
    return null;
  }

  const isValid = await verifyPassword(password, ADMIN_USER.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    email: ADMIN_USER.email,
    role: ADMIN_USER.role,
    name: ADMIN_USER.name
  };
}

export function isValidUser(user: unknown): user is AuthUser {
  return user !== null && 
         typeof user === 'object' &&
         user !== undefined &&
         'email' in user &&
         'role' in user &&
         'name' in user &&
         typeof (user as Record<string, unknown>).email === 'string' && 
         typeof (user as Record<string, unknown>).role === 'string' && 
         typeof (user as Record<string, unknown>).name === 'string';
}