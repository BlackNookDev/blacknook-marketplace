import { randomBytes } from 'crypto';
import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';

const ALLOWED = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function getUploadDir() {
  return process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), 'uploads');
}

export function isAllowedImage(mime: string) {
  return ALLOWED.has(mime);
}

export async function saveUploadedImage(buffer: Buffer, mime: string) {
  const ext = ALLOWED.get(mime);
  if (!ext) {
    throw new Error('Desteklenmeyen görsel türü.');
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error('Görsel 4 MB altında olmalı.');
  }

  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`;
  await writeFile(path.join(dir, name), buffer);
  return `/api/uploads/${name}`;
}

export function safeUploadName(name: string) {
  return /^[a-zA-Z0-9._-]+$/.test(name) ? name : null;
}

export async function readUploadedFile(name: string) {
  const safe = safeUploadName(name);
  if (!safe) return null;
  try {
    const filePath = path.join(getUploadDir(), safe);
    const data = await readFile(filePath);
    return { data, filePath };
  } catch {
    return null;
  }
}

export function mimeFromName(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'application/octet-stream';
}
