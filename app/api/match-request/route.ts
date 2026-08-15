import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/sessionUser';
import pool from '@/lib/db';
import {
  matchAssigneeEmail,
  matchTeamEmail,
  matchUserEmail,
} from '@/lib/emailTemplates';
import { getMatchMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';
import { pickMatchAssignee, toPublicPerson } from '@/lib/matchAssign';
import { createMatchConversation } from '@/lib/conversations';
import { notifyUser } from '@/lib/notify';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status')?.trim() || 'active';
    const params: any[] = [user.id];
    let sql = `SELECT
         mr.id, mr.name, mr.email, mr.need, mr.status, mr.created_at,
         mr.conversation_id, mr.assigned_user_id,
         u.name AS assigned_name, u.match_skills AS assigned_skills
       FROM match_requests mr
       LEFT JOIN users u ON u.id = mr.assigned_user_id
       WHERE mr.user_id = ?`;

    if (status !== 'all') {
      sql += ' AND mr.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY mr.created_at DESC LIMIT 50';

    const [rows]: any = await pool.query(sql, params);

    return NextResponse.json({
      requests: (rows || []).map((row: any) => ({
        id: Number(row.id),
        name: row.name,
        email: row.email,
        need: row.need,
        status: row.status,
        createdAt: row.created_at,
        conversationId: row.conversation_id ? Number(row.conversation_id) : null,
        assigned: row.assigned_user_id
          ? {
              id: Number(row.assigned_user_id),
              name: row.assigned_name || 'Blacknook',
              skills: row.assigned_skills || '',
            }
          : null,
      })),
    });
  } catch (error) {
    console.error('[match-request] Listeleme hatası:', error);
    return NextResponse.json({ error: 'Talepler yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Eşleşmek için giriş yapın.' }, { status: 401 });
    }

    const body = await req.json();
    const need = typeof body.need === 'string' ? body.need.trim() : '';

    if (!need) {
      return NextResponse.json({ error: 'İhtiyacınızı kısaca yazın.' }, { status: 400 });
    }

    if (need.length > 4000) {
      return NextResponse.json({ error: 'Talep metni çok uzun.' }, { status: 400 });
    }

    const name = user.name || 'İsimsiz kullanıcı';
    const email = user.email;
    const assignee = await pickMatchAssignee(user.id);

    let insertId: number | undefined;
    try {
      const [result]: any = await pool.query(
        'INSERT INTO match_requests (user_id, name, email, need, status) VALUES (?, ?, ?, ?, ?)',
        [user.id, name, email, need, 'active']
      );
      if (result.insertId != null) insertId = Number(result.insertId);
    } catch (dbError) {
      console.error('[match-request] DB kayıt hatası:', dbError);
      return NextResponse.json(
        { error: 'Talep kaydedilemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      );
    }

    if (!insertId) {
      return NextResponse.json({ error: 'Talep kaydedilemedi.' }, { status: 500 });
    }

    let conversationId: number | null = null;
    if (assignee) {
      try {
        conversationId = await createMatchConversation({
          requesterId: user.id,
          assigneeId: assignee.id,
          matchRequestId: insertId,
          need,
        });
      } catch (convError) {
        console.error('[match-request] Konuşma hatası:', convError);
      }
    }

    const messagesHref = conversationId
      ? `/account/messages?c=${conversationId}`
      : '/account/requests';

    await notifyUser({
      userId: user.id,
      title: assignee ? `${assignee.name} ile eşleştiniz` : 'Eşleşme talebiniz alındı',
      body: need.length > 120 ? `${need.slice(0, 117)}…` : need,
      href: messagesHref,
    });

    if (assignee) {
      await notifyUser({
        userId: assignee.id,
        title: `${name} sizinle eşleşmek istiyor`,
        body: need.length > 120 ? `${need.slice(0, 117)}…` : need,
        href: messagesHref,
      });
    }

    const teamMail = matchTeamEmail({
      name,
      email,
      need,
      requestId: insertId,
      assigneeName: assignee?.name,
    });
    const teamResult = await sendPlatformEmail({
      to: getMatchMailTo(),
      replyTo: email,
      ...teamMail,
    });

    if (!teamResult.ok) {
      console.error('[match-request] Ekip SMTP hatası (talep DB’de):', teamResult.error);
    }

    const userMail = matchUserEmail({
      name,
      need,
      requestId: insertId,
      assigneeName: assignee?.name,
      conversationId,
    });
    const userResult = await sendUserEmail({ to: email, ...userMail });
    if (!userResult.ok) {
      console.warn('[match-request] Kullanıcı onay maili gönderilemedi:', userResult.error);
    }

    if (assignee?.email) {
      const assigneeMail = matchAssigneeEmail({
        assigneeName: assignee.name,
        requesterName: name,
        need,
        conversationId,
      });
      const assigneeResult = await sendUserEmail({ to: assignee.email, ...assigneeMail });
      if (!assigneeResult.ok) {
        console.warn('[match-request] Atanan kişi maili gönderilemedi:', assigneeResult.error);
      }
    }

    return NextResponse.json({
      ok: true,
      id: insertId,
      conversationId,
      assigned: assignee
        ? {
            name: assignee.name,
            skills: assignee.skills,
            ...toPublicPerson(assignee),
          }
        : null,
      mailed: teamResult.ok || userResult.ok,
    });
  } catch (error) {
    console.error('[match-request] Hata:', error);
    return NextResponse.json(
      { error: 'Talep gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
