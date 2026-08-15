import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/sessionUser';
import {
  getPeer,
  getThread,
  listInbox,
  markConversationRead,
  sendConversationMessage,
  userInConversation,
} from '@/lib/conversations';
import { notifyUser } from '@/lib/notify';
import { messageReceivedEmail } from '@/lib/emailTemplates';
import { sendUserEmail } from '@/lib/mail';
import pool from '@/lib/db';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { failResponse, logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const conversationId = Number(new URL(req.url).searchParams.get('conversationId') || 0);
    if (conversationId > 0) {
      const allowed = await userInConversation(conversationId, user.id);
      if (!allowed) {
        return NextResponse.json({ error: 'Konuşma bulunamadı.' }, { status: 404 });
      }
      const thread = await getThread(conversationId, user.id);
      if (!thread) {
        return NextResponse.json({ error: 'Konuşma bulunamadı.' }, { status: 404 });
      }
      await markConversationRead(conversationId, user.id);
      return NextResponse.json({ conversation: thread });
    }

    const conversations = await listInbox(user.id);
    return NextResponse.json({ conversations });
  } catch (error) {
    const logId = await logServerError({ source: 'messages.GET', error, req });
    return failResponse('Mesajlar yüklenemedi.', logId);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const conversationId = Number(body.conversationId || 0);
    const text = typeof body.body === 'string' ? body.body.trim() : '';

    if (!conversationId) {
      return NextResponse.json({ error: 'Konuşma gerekli.' }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: 'Mesaj yazın.' }, { status: 400 });
    }
    if (text.length > 4000) {
      return NextResponse.json({ error: 'Mesaj çok uzun.' }, { status: 400 });
    }

    const allowed = await userInConversation(conversationId, user.id);
    if (!allowed) {
      return NextResponse.json({ error: 'Konuşma bulunamadı.' }, { status: 404 });
    }

    const peer = await getPeer(conversationId, user.id);
    if (!peer) {
      return NextResponse.json({ error: 'Alıcı bulunamadı.' }, { status: 400 });
    }

    const id = await sendConversationMessage({
      conversationId,
      senderId: user.id,
      receiverId: peer.id,
      body: text,
    });

    const href = `/account/messages?c=${conversationId}`;
    await notifyUser({
      userId: peer.id,
      title: `${user.name} size yazdı`,
      body: text.length > 120 ? `${text.slice(0, 117)}…` : text,
      href,
    });

    try {
      const [rows]: any = await pool.query('SELECT email FROM users WHERE id = ? LIMIT 1', [
        peer.id,
      ]);
      const to = rows?.[0]?.email;
      if (to) {
        const mail = messageReceivedEmail({
          toName: peer.name,
          fromName: user.name,
          preview: text,
          conversationId,
        });
        await sendUserEmail({ to, ...mail });
      }
    } catch (mailError) {
      console.warn('[messages] E-posta gönderilemedi:', mailError);
    }

    return NextResponse.json({
      ok: true,
      message: {
        id,
        senderId: user.id,
        body: text,
        createdAt: new Date().toISOString(),
        mine: true,
      },
    });
  } catch (error) {
    const logId = await logServerError({ source: 'messages.POST', error, req });
    return failResponse('Mesaj gönderilemedi.', logId);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }
    const body = await req.json().catch(() => ({}));
    const conversationId = Number(body.conversationId || 0);
    if (!conversationId) {
      return NextResponse.json({ error: 'Konuşma gerekli.' }, { status: 400 });
    }
    const allowed = await userInConversation(conversationId, user.id);
    if (!allowed) {
      return NextResponse.json({ error: 'Konuşma bulunamadı.' }, { status: 404 });
    }
    await markConversationRead(conversationId, user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const logId = await logServerError({ source: 'messages.PATCH', error, req });
    return failResponse('Güncellenemedi.', logId);
  }
}
