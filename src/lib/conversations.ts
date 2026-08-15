import pool from '@/lib/db';
import { colorFromSeed, initialsFromName } from '@/lib/matchAssign';

export type InboxPeer = {
  id: number;
  name: string;
  initials: string;
  color: string;
  skills: string;
};

export type InboxConversation = {
  id: number;
  type: string;
  matchNeed: string;
  peer: InboxPeer;
  lastMessage: { body: string; createdAt: string; senderId: number } | null;
  unread: number;
  updatedAt: string;
};

export type ThreadMessage = {
  id: number;
  senderId: number;
  body: string;
  createdAt: string;
  mine: boolean;
};

function peerFromRow(row: any): InboxPeer {
  const id = Number(row.peer_id);
  const name = row.peer_name || 'Blacknook';
  return {
    id,
    name,
    initials: initialsFromName(name),
    color: colorFromSeed(String(id)),
    skills: row.peer_skills || '',
  };
}

export async function userInConversation(conversationId: number, userId: number) {
  const [rows]: any = await pool.query(
    `SELECT 1 FROM conversation_participants
     WHERE conversation_id = ? AND user_id = ?
     LIMIT 1`,
    [conversationId, userId]
  );
  return Boolean(rows?.[0]);
}

export async function getPeer(conversationId: number, userId: number): Promise<InboxPeer | null> {
  const [rows]: any = await pool.query(
    `SELECT u.id AS peer_id, u.name AS peer_name, u.match_skills AS peer_skills
     FROM conversation_participants cp
     JOIN users u ON u.id = cp.user_id
     WHERE cp.conversation_id = ? AND cp.user_id <> ?
     LIMIT 1`,
    [conversationId, userId]
  );
  if (!rows?.[0]) return null;
  return peerFromRow(rows[0]);
}

export async function listInbox(userId: number): Promise<InboxConversation[]> {
  const [rows]: any = await pool.query(
    `SELECT
        c.id,
        c.type,
        c.created_at,
        COALESCE(mr.need, '') AS match_need,
        peer.id AS peer_id,
        peer.name AS peer_name,
        peer.match_skills AS peer_skills,
        (
          SELECT m.message FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC, m.id DESC
          LIMIT 1
        ) AS last_body,
        (
          SELECT m.sender_id FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC, m.id DESC
          LIMIT 1
        ) AS last_sender_id,
        (
          SELECT m.created_at FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC, m.id DESC
          LIMIT 1
        ) AS last_at,
        me.last_read_at,
        (
          SELECT COUNT(*)::int FROM messages m
          WHERE m.conversation_id = c.id
            AND m.sender_id <> ?
            AND (me.last_read_at IS NULL OR m.created_at > me.last_read_at)
        ) AS unread
     FROM conversation_participants me
     JOIN conversations c ON c.id = me.conversation_id
     JOIN conversation_participants other
       ON other.conversation_id = c.id AND other.user_id <> me.user_id
     JOIN users peer ON peer.id = other.user_id
     LEFT JOIN match_requests mr ON mr.id = c.match_request_id
     WHERE me.user_id = ?
     ORDER BY COALESCE(
       (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1),
       c.created_at
     ) DESC`,
    [userId, userId]
  );

  return (rows || []).map((row: any) => {
    const lastAt = row.last_at || row.created_at;
    return {
      id: Number(row.id),
      type: row.type || 'match',
      matchNeed: row.match_need || '',
      peer: peerFromRow(row),
      lastMessage: row.last_body
        ? {
            body: String(row.last_body),
            createdAt: lastAt,
            senderId: Number(row.last_sender_id),
          }
        : null,
      unread: Number(row.unread || 0),
      updatedAt: lastAt,
    };
  });
}

export async function getThread(conversationId: number, userId: number) {
  const [metaRows]: any = await pool.query(
    `SELECT c.id, c.type, COALESCE(mr.need, '') AS match_need
     FROM conversations c
     LEFT JOIN match_requests mr ON mr.id = c.match_request_id
     WHERE c.id = ?`,
    [conversationId]
  );
  if (!metaRows?.[0]) return null;

  const peer = await getPeer(conversationId, userId);
  const [msgRows]: any = await pool.query(
    `SELECT id, sender_id, message, created_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC, id ASC
     LIMIT 200`,
    [conversationId]
  );

  return {
    id: Number(metaRows[0].id),
    type: metaRows[0].type || 'match',
    matchNeed: metaRows[0].match_need || '',
    peer,
    messages: (msgRows || []).map((row: any) => ({
      id: Number(row.id),
      senderId: Number(row.sender_id),
      body: String(row.message || ''),
      createdAt: row.created_at,
      mine: Number(row.sender_id) === userId,
    })) as ThreadMessage[],
  };
}

export async function markConversationRead(conversationId: number, userId: number) {
  await pool.query(
    `UPDATE conversation_participants
     SET last_read_at = CURRENT_TIMESTAMP
     WHERE conversation_id = ? AND user_id = ?`,
    [conversationId, userId]
  );
  await pool.query(
    `UPDATE messages SET is_read = TRUE
     WHERE conversation_id = ? AND receiver_id = ? AND is_read = FALSE`,
    [conversationId, userId]
  );
}

export async function createMatchConversation(params: {
  requesterId: number;
  assigneeId: number;
  matchRequestId: number;
  need: string;
}) {
  const [conv]: any = await pool.query(
    `INSERT INTO conversations (type, match_request_id) VALUES ('match', ?)`,
    [params.matchRequestId]
  );
  const conversationId = Number(conv.insertId);
  if (!conversationId) {
    throw new Error('Konuşma oluşturulamadı.');
  }

  await pool.query(
    `INSERT INTO conversation_participants (conversation_id, user_id, last_read_at)
     VALUES (?, ?, CURRENT_TIMESTAMP), (?, ?, NULL)
     RETURNING conversation_id`,
    [conversationId, params.requesterId, conversationId, params.assigneeId]
  );

  await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, conversation_id, message, is_read)
     VALUES (?, ?, ?, ?, FALSE)`,
    [params.requesterId, params.assigneeId, conversationId, params.need]
  );

  await pool.query(
    `UPDATE match_requests SET assigned_user_id = ?, conversation_id = ? WHERE id = ?`,
    [params.assigneeId, conversationId, params.matchRequestId]
  );

  return conversationId;
}

export async function sendConversationMessage(params: {
  conversationId: number;
  senderId: number;
  receiverId: number;
  body: string;
}) {
  const [result]: any = await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, conversation_id, message, is_read)
     VALUES (?, ?, ?, ?, FALSE)`,
    [params.senderId, params.receiverId, params.conversationId, params.body]
  );
  return Number(result.insertId);
}
