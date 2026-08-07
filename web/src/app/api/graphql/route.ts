import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { type NextRequest, NextResponse } from 'next/server';
import { schema } from '@graphql/schema';
import { verifyToken } from '@/lib/jwt';
import { ADMIN_SESSION_COOKIE } from '@/lib/session';
import type { Context } from '@graphql/builder';

const server = new ApolloServer<Context>({
  schema,
  includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
});

const apolloHandler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    const auth = req.headers.get('authorization');
    const bearerToken = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    // fallback sul cookie httpOnly: le chiamate Apollo lato browser del pannello admin
    // non possono leggerlo/reinviarlo come header, ma il browser lo allega da solo
    const cookieToken = req.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? null;
    const token = bearerToken ?? cookieToken;
    if (!token) return { userId: null };

    const payload = await verifyToken(token);
    return { userId: payload?.userId ?? null };
  },
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN ?? 'http://localhost:8081',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

type RouteContext = { params: Promise<Record<string, string>> };

function checkApiKey(req: NextRequest): boolean {
  const key = req.headers.get('x-api-key');
  return key === process.env.CLIENT_API_KEY;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest, _ctx: RouteContext) {
  if (!checkApiKey(req)) {
    return new NextResponse('Unauthorized', { status: 401, headers: CORS_HEADERS });
  }
  const res = await apolloHandler(req);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export async function POST(req: NextRequest, _ctx: RouteContext) {
  if (!checkApiKey(req)) {
    return new NextResponse('Unauthorized', { status: 401, headers: CORS_HEADERS });
  }
  const res = await apolloHandler(req);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}
