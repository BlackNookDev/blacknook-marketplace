import pool from '@/lib/db';
import type {
  ApplicantType,
  DeveloperApplicationStatus,
} from '@/lib/developerApplicationsTypes';

export type {
  ApplicantType,
  DeveloperApplicationStatus,
} from '@/lib/developerApplicationsTypes';

export type DeveloperApplication = {
  id: number;
  userId: number;
  applicantType: ApplicantType;
  fullName: string;
  companyName: string;
  websiteUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  skills: string;
  about: string;
  answers: Record<string, string>;
  status: DeveloperApplicationStatus;
  rejectReason: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  userEmail?: string;
  userName?: string;
};

function parseAnswers(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v == null) continue;
    out[k] = String(v);
  }
  return out;
}

function rowToApp(row: any): DeveloperApplication {
  const applicantType: ApplicantType =
    row.applicant_type === 'entrepreneur' ? 'entrepreneur' : 'developer';
  return {
    id: Number(row.id),
    userId: Number(row.user_id),
    applicantType,
    fullName: String(row.full_name || ''),
    companyName: String(row.company_name || ''),
    websiteUrl: String(row.website_url || ''),
    githubUrl: String(row.github_url || ''),
    portfolioUrl: String(row.portfolio_url || ''),
    skills: String(row.skills || ''),
    about: String(row.about || ''),
    answers: parseAnswers(row.answers),
    status: row.status as DeveloperApplicationStatus,
    rejectReason: String(row.reject_reason || ''),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : '',
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : '',
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at).toISOString() : null,
    userEmail: row.user_email ? String(row.user_email) : undefined,
    userName: row.user_name ? String(row.user_name) : undefined,
  };
}

export async function getLatestDeveloperApplication(
  userId: number
): Promise<DeveloperApplication | null> {
  const [rows]: any = await pool.query(
    `SELECT * FROM developer_applications
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  return rows[0] ? rowToApp(rows[0]) : null;
}

/** Onaylı geliştirici veya vendor/admin portal & ürün ekleyebilir */
export async function userCanAccessDeveloperPortal(user: {
  id: number;
  role: string;
}): Promise<boolean> {
  if (user.role === 'admin' || user.role === 'vendor') return true;
  const app = await getLatestDeveloperApplication(user.id);
  return app?.status === 'approved';
}

export async function listDeveloperApplications(opts?: {
  status?: DeveloperApplicationStatus | 'all';
}): Promise<DeveloperApplication[]> {
  const status = opts?.status && opts.status !== 'all' ? opts.status : null;
  const [rows]: any = status
    ? await pool.query(
        `SELECT d.*, u.email AS user_email, u.name AS user_name
         FROM developer_applications d
         JOIN users u ON u.id = d.user_id
         WHERE d.status = ?
         ORDER BY d.created_at DESC`,
        [status]
      )
    : await pool.query(
        `SELECT d.*, u.email AS user_email, u.name AS user_name
         FROM developer_applications d
         JOIN users u ON u.id = d.user_id
         ORDER BY
           CASE d.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
           d.created_at DESC`
      );
  return (rows || []).map(rowToApp);
}

export { rowToApp };
