import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/sessionUser';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { getCoderPublicUrl, isCoderConfigured } from '@/lib/coderService';
import {
  createUserWorkspace,
  findWorkspaceByUser,
  startUserWorkspace,
  stopUserWorkspace,
  syncWorkspaceStatus,
} from '@/lib/developerWorkspaces';

export const dynamic = 'force-dynamic';

/** GET — mevcut workspace durumu */
export async function GET(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    if (!isCoderConfigured()) {
      return NextResponse.json({
        configured: false,
        coderUrl: getCoderPublicUrl(),
        workspace: null,
        message:
          'Coder API henüz yapılandırılmadı. CODER_API_TOKEN ve CODER_TEMPLATE_ID gerekli.',
      });
    }

    const workspaceId = req.nextUrl.searchParams.get('workspaceId');
    const projectName = req.nextUrl.searchParams.get('project') || 'default';

    if (workspaceId) {
      const info = await syncWorkspaceStatus(user.id, workspaceId);
      return NextResponse.json({
        configured: true,
        coderUrl: getCoderPublicUrl(),
        workspace: info,
      });
    }

    const stored = await findWorkspaceByUser(user.id, projectName);
    if (!stored) {
      return NextResponse.json({
        configured: true,
        coderUrl: getCoderPublicUrl(),
        workspace: null,
      });
    }

    const info = await syncWorkspaceStatus(user.id, stored.coderWorkspaceId);
    return NextResponse.json({
      configured: true,
      coderUrl: getCoderPublicUrl(),
      workspace: info,
    });
  } catch (error) {
    console.error('[workspace GET]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Durum alınamadı.' },
      { status: 500 }
    );
  }
}

/**
 * POST — create | start | stop
 * body: { action?: 'create'|'start'|'stop', projectName?: string, workspaceId?: string }
 */
export async function POST(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    if (!isCoderConfigured()) {
      return NextResponse.json(
        {
          error:
            'Coder yapılandırılmadı. CODER_API_TOKEN ve CODER_TEMPLATE_ID ayarlayın.',
          coderUrl: getCoderPublicUrl(),
        },
        { status: 503 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      projectName?: string;
      workspaceId?: string;
    };

    const action = (body.action || 'create').toLowerCase();
    const projectName = (body.projectName || 'default').trim().slice(0, 64) || 'default';

    if (action === 'create') {
      const workspace = await createUserWorkspace(user.id, projectName);
      return NextResponse.json({ workspace });
    }

    if (action === 'stop') {
      if (!body.workspaceId) {
        return NextResponse.json({ error: 'workspaceId gerekli.' }, { status: 400 });
      }
      const workspace = await stopUserWorkspace(user.id, body.workspaceId);
      return NextResponse.json({ workspace });
    }

    if (action === 'start') {
      if (!body.workspaceId) {
        return NextResponse.json({ error: 'workspaceId gerekli.' }, { status: 400 });
      }
      const workspace = await startUserWorkspace(user.id, body.workspaceId);
      return NextResponse.json({ workspace });
    }

    return NextResponse.json({ error: 'Geçersiz action.' }, { status: 400 });
  } catch (error) {
    console.error('[workspace POST]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'İşlem başarısız.' },
      { status: 500 }
    );
  }
}
