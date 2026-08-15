import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool from '@/lib/db';

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const email = user?.email?.trim().toLowerCase();
  if (!email || !user) return null;

  const sessionId = Number(user.id);
  const role = user.role || 'user';
  const name = user.name?.trim() || email.split('@')[0];

  if (Number.isFinite(sessionId) && sessionId > 0) {
    return { id: sessionId, email, name, role };
  }

  const [rows]: any = await pool.query('SELECT id, role, name FROM users WHERE LOWER(email) = ?', [
    email,
  ]);
  if (!rows[0]) return null;
  return {
    id: Number(rows[0].id),
    email,
    name: rows[0].name || name,
    role: rows[0].role || role,
  };
}
