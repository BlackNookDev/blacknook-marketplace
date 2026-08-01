import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { ensureAuthEnv } from '@/lib/authEnv';

ensureAuthEnv();

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
