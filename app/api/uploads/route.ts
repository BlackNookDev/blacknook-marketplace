import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/sessionUser';
import { isAllowedImage, MAX_UPLOAD_BYTES, saveUploadedImage } from '@/lib/uploads';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Görsel yüklemek için giriş yapın.' }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Dosya gerekli.' }, { status: 400 });
    }
    if (!isAllowedImage(file.type)) {
      return NextResponse.json({ error: 'PNG, JPG, WebP veya GIF yükleyin.' }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Görsel 4 MB altında olmalı.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveUploadedImage(buffer, file.type);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error('[uploads] Hata:', error);
    return NextResponse.json({ error: 'Görsel kaydedilemedi.' }, { status: 500 });
  }
}
