import pool from '@/lib/db';

const PALETTE = [
  '#34d399',
  '#22d3ee',
  '#a3e635',
  '#fbbf24',
  '#60a5fa',
  '#f472b6',
  '#c084fc',
  '#2dd4bf',
];

export type MatchPerson = {
  id: number;
  name: string;
  email: string;
  role: string;
  skills: string;
  bio: string;
};

export type MatchPublicPerson = {
  id: string;
  initials: string;
  color: string;
  role: string;
};

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  }
  const compact = (parts[0] || name || 'BN').replace(/[^a-zA-Z0-9]/g, '');
  return compact.slice(0, 2).toUpperCase() || 'BN';
}

export function colorFromSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

export function toPublicPerson(person: { id: number; name: string; skills?: string; role?: string }): MatchPublicPerson {
  return {
    id: `u${person.id}`,
    initials: initialsFromName(person.name),
    color: colorFromSeed(String(person.id)),
    role: person.skills || person.role || 'Geliştirici',
  };
}

function mapPerson(row: any): MatchPerson {
  return {
    id: Number(row.id),
    name: row.name || 'Blacknook',
    email: row.email || '',
    role: row.role || 'user',
    skills: row.match_skills || '',
    bio: row.bio || '',
  };
}

export async function listMatchPool(limit = 8): Promise<MatchPerson[]> {
  const [rows]: any = await pool.query(
    `SELECT id, name, email, role, match_skills, bio
     FROM users
     WHERE match_available = TRUE
     ORDER BY id ASC
     LIMIT ?`,
    [limit]
  );
  return (rows || []).map(mapPerson);
}

export async function countMatchPool(): Promise<number> {
  const [rows]: any = await pool.query(
    `SELECT COUNT(*)::int AS count FROM users WHERE match_available = TRUE`
  );
  return Number(rows?.[0]?.count || 0);
}

export async function pickMatchAssignee(excludeUserId: number): Promise<MatchPerson | null> {
  const [poolRows]: any = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.match_skills, u.bio,
            (
              SELECT COUNT(*)::int
              FROM match_requests mr
              WHERE mr.assigned_user_id = u.id AND mr.status = 'active'
            ) AS load
     FROM users u
     WHERE u.match_available = TRUE
       AND u.id <> ?
     ORDER BY load ASC, u.id ASC
     LIMIT 1`,
    [excludeUserId]
  );
  if (poolRows?.[0]) return mapPerson(poolRows[0]);

  const [adminRows]: any = await pool.query(
    `SELECT id, name, email, role, match_skills, bio
     FROM users
     WHERE role = 'admin' AND id <> ?
     ORDER BY id ASC
     LIMIT 1`,
    [excludeUserId]
  );
  if (adminRows?.[0]) return mapPerson(adminRows[0]);

  return null;
}
