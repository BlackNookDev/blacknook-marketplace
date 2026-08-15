import { NextRequest, NextResponse } from 'next/server';
import { mimeFromName, readUploadedFile } from '@/lib/uploads';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const name = params.path?.[0];
  if (!name || params.path.length !== 1) {
    return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 404 });
  }

  const file = await readUploadedFile(name);
  if (!file) {
    return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      'Content-Type': mimeFromName(name),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
