import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import {
  getLatestDeveloperApplication,
  listDeveloperApplications,
  rowToApp,
  type ApplicantType,
} from '@/lib/developerApplications';

function cleanUrl(raw: unknown, max = 500) {
  const s = String(raw || '').trim().slice(0, max);
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) return `https://${s}`;
  return s;
}

function cleanAnswers(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const key = String(k).slice(0, 64);
    if (!key) continue;
    out[key] = String(v ?? '')
      .trim()
      .slice(0, 4000);
  }
  return out;
}

function requireAnswer(
  answers: Record<string, string>,
  key: string,
  minLen = 1
): string | null {
  const v = (answers[key] || '').trim();
  if (v.length < minLen) return key;
  return null;
}

export async function GET(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const scope = req.nextUrl.searchParams.get('scope');
    if (scope === 'admin') {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
      }
      const status = req.nextUrl.searchParams.get('status') as
        | 'pending'
        | 'approved'
        | 'rejected'
        | 'all'
        | null;
      const applications = await listDeveloperApplications({
        status: status || 'all',
      });
      return NextResponse.json({ applications });
    }

    const application = await getLatestDeveloperApplication(user.id);
    return NextResponse.json({
      application,
      canAccessPortal:
        user.role === 'admin' ||
        user.role === 'vendor' ||
        application?.status === 'approved',
    });
  } catch (error) {
    console.error('[developer-applications GET]', error);
    return NextResponse.json({ error: 'Başvurular yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    if (user.role === 'admin' || user.role === 'vendor') {
      return NextResponse.json(
        { error: 'Zaten geliştirici portalına erişiminiz var.', canAccessPortal: true },
        { status: 400 }
      );
    }

    const latest = await getLatestDeveloperApplication(user.id);
    if (latest?.status === 'pending') {
      return NextResponse.json(
        { error: 'Bekleyen başvurunuz var.', application: latest },
        { status: 409 }
      );
    }
    if (latest?.status === 'approved') {
      return NextResponse.json(
        { error: 'Başvurunuz zaten onaylı.', application: latest, canAccessPortal: true },
        { status: 400 }
      );
    }

    const body = await req.json();
    const applicantType: ApplicantType =
      body.applicantType === 'entrepreneur' ? 'entrepreneur' : 'developer';
    const fullName = String(body.fullName || user.name || '').trim().slice(0, 255);
    const about = String(body.about || '').trim().slice(0, 4000);
    const companyName = String(body.companyName || '').trim().slice(0, 255);
    const skills = String(body.skills || '').trim().slice(0, 1000);
    const websiteUrl = cleanUrl(body.websiteUrl);
    const githubUrl = cleanUrl(body.githubUrl);
    const portfolioUrl = cleanUrl(body.portfolioUrl);
    const answers = cleanAnswers(body.answers);
    if (answers.linkedinUrl) answers.linkedinUrl = cleanUrl(answers.linkedinUrl);
    if (answers.demoUrl) answers.demoUrl = cleanUrl(answers.demoUrl);
    if (answers.pitchDeckUrl) answers.pitchDeckUrl = cleanUrl(answers.pitchDeckUrl);

    if (fullName.length < 2) {
      return NextResponse.json({ error: 'Ad soyad gerekli.' }, { status: 400 });
    }
    if (about.length < 60) {
      return NextResponse.json(
        { error: 'Hikâye / vizyon alanını en az 60 karakter yazın.' },
        { status: 400 }
      );
    }

    if (applicantType === 'developer') {
      if (!githubUrl) {
        return NextResponse.json({ error: 'GitHub profili zorunlu.' }, { status: 400 });
      }
      if (skills.length < 3) {
        return NextResponse.json({ error: 'Teknik yığın / beceriler zorunlu.' }, { status: 400 });
      }
      const missing =
        requireAnswer(answers, 'yearsExperience') ||
        requireAnswer(answers, 'primaryRole') ||
        requireAnswer(answers, 'notableProjects', 40) ||
        requireAnswer(answers, 'productToList', 20) ||
        requireAnswer(answers, 'deliveryModel') ||
        requireAnswer(answers, 'supportHours') ||
        requireAnswer(answers, 'englishLevel') ||
        requireAnswer(answers, 'whyBlacknook', 20);
      if (missing) {
        return NextResponse.json(
          { error: `Eksik veya kısa alan: ${missing}` },
          { status: 400 }
        );
      }
    } else {
      if (companyName.length < 2) {
        return NextResponse.json({ error: 'Şirket / girişim adı zorunlu.' }, { status: 400 });
      }
      const missing =
        requireAnswer(answers, 'founderRole') ||
        requireAnswer(answers, 'productName', 2) ||
        requireAnswer(answers, 'oneLiner', 10) ||
        requireAnswer(answers, 'problem', 30) ||
        requireAnswer(answers, 'solution', 30) ||
        requireAnswer(answers, 'targetCustomer', 20) ||
        requireAnswer(answers, 'stage') ||
        requireAnswer(answers, 'revenueStatus') ||
        requireAnswer(answers, 'teamSize') ||
        requireAnswer(answers, 'traction', 20) ||
        requireAnswer(answers, 'goToMarket', 20) ||
        requireAnswer(answers, 'productToList', 20) ||
        requireAnswer(answers, 'deliveryModel') ||
        requireAnswer(answers, 'launchTimeline') ||
        requireAnswer(answers, 'supportPlan', 15) ||
        requireAnswer(answers, 'whyBlacknook', 20);
      if (missing) {
        return NextResponse.json(
          { error: `Eksik veya kısa alan: ${missing}` },
          { status: 400 }
        );
      }
    }

    const [result]: any = await pool.query(
      `INSERT INTO developer_applications
        (user_id, applicant_type, full_name, company_name, website_url, github_url, portfolio_url, skills, about, answers, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, 'pending')`,
      [
        user.id,
        applicantType,
        fullName,
        companyName || null,
        websiteUrl || null,
        githubUrl || null,
        portfolioUrl || null,
        skills || null,
        about,
        JSON.stringify(answers),
      ]
    );

    const [rows]: any = await pool.query(
      `SELECT * FROM developer_applications WHERE id = ?`,
      [result.insertId]
    );

    const label = applicantType === 'entrepreneur' ? 'Girişimci' : 'Geliştirici';
    try {
      await pool.query(
        `INSERT INTO user_notifications (user_id, title, body, href, is_read)
         VALUES (?, ?, ?, ?, FALSE)`,
        [
          user.id,
          `${label} başvurunuz alındı`,
          'İnceleme sonrası bilgilendirileceksiniz.',
          '/developers/status',
        ]
      );
    } catch {
      /* bildirim opsiyonel */
    }

    return NextResponse.json({ application: rowToApp(rows[0]) }, { status: 201 });
  } catch (error) {
    console.error('[developer-applications POST]', error);
    return NextResponse.json({ error: 'Başvuru kaydedilemedi.' }, { status: 500 });
  }
}
