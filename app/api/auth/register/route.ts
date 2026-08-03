import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { normalizeEmail } from '@/lib/authUrl';

const ALLOWED_ROLES = new Set(['user', 'vendor']);

export async function POST(req: NextRequest) {
  try {
    const { name: rawName, email: rawEmail, password, role: rawRole } = await req.json();

    if (!rawEmail || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre zorunludur.' }, { status: 400 });
    }

    const email = normalizeEmail(String(rawEmail));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta girin.' }, { status: 400 });
    }

    if (String(password).length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalı.' }, { status: 400 });
    }

    const nameFromEmail = email.split('@')[0] || 'Kullanıcı';
    const name =
      typeof rawName === 'string' && rawName.trim() ? rawName.trim() : nameFromEmail;

    const role = ALLOWED_ROLES.has(rawRole) ? rawRole : 'user';

    const [existing]: any = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [
      email,
    ]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    return NextResponse.json({ id: result.insertId, name, email, role }, { status: 201 });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json({ error: 'Kayıt sırasında bir hata oluştu.' }, { status: 500 });
  }
}
