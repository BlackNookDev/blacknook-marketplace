import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const [rows]: any = await pool.query(
      `SELECT name, bio, role, match_available, match_skills
       FROM users WHERE id = ? LIMIT 1`,
      [user.id]
    );
    const row = rows?.[0];
    if (!row) {
      return NextResponse.json({ error: 'Profil bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({
      name: row.name || user.name,
      bio: row.bio || '',
      role: row.role || user.role,
      matchAvailable: Boolean(row.match_available),
      matchSkills: row.match_skills || '',
    });
  } catch (error) {
    console.error('[account/profile] Okuma hatası:', error);
    return NextResponse.json({ error: 'Profil yüklenemedi.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const name =
      typeof body.name === 'string' ? body.name.trim().slice(0, 80) : undefined;
    const bio = typeof body.bio === 'string' ? body.bio.trim().slice(0, 500) : undefined;
    const matchSkills =
      typeof body.matchSkills === 'string' ? body.matchSkills.trim().slice(0, 120) : undefined;
    const matchAvailable =
      typeof body.matchAvailable === 'boolean' ? body.matchAvailable : undefined;

    const [rows]: any = await pool.query(
      `SELECT name, bio, match_available, match_skills FROM users WHERE id = ? LIMIT 1`,
      [user.id]
    );
    const current = rows?.[0];
    if (!current) {
      return NextResponse.json({ error: 'Profil bulunamadı.' }, { status: 404 });
    }

    const nextName = name || current.name;
    const nextBio = bio !== undefined ? bio : current.bio || '';
    const nextSkills = matchSkills !== undefined ? matchSkills : current.match_skills || '';
    const nextAvailable =
      matchAvailable !== undefined ? matchAvailable : Boolean(current.match_available);

    await pool.query(
      `UPDATE users
       SET name = ?, bio = ?, match_skills = ?, match_available = ?
       WHERE id = ?`,
      [nextName, nextBio, nextSkills || null, nextAvailable, user.id]
    );

    return NextResponse.json({
      name: nextName,
      bio: nextBio,
      matchAvailable: nextAvailable,
      matchSkills: nextSkills,
    });
  } catch (error) {
    console.error('[account/profile] Kayıt hatası:', error);
    return NextResponse.json({ error: 'Profil kaydedilemedi.' }, { status: 500 });
  }
}
