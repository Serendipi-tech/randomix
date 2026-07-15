import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { type NextRequest, NextResponse } from 'next/server';
import { schema } from '@graphql/schema';
import { verifyToken } from '@/lib/jwt';
import type { Context } from '@graphql/builder';

const server = new ApolloServer<Context>({ schema });

const apolloHandler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    const auth = req.headers.get('authorization');
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return { userId: null };

    const payload = await verifyToken(token);
    return { userId: payload?.userId ?? null };
  },
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN ?? 'http://localhost:8081',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

type RouteContext = { params: Promise<Record<string, string>> };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest, _ctx: RouteContext) {
  const res = await apolloHandler(req);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export async function POST(req: NextRequest, _ctx: RouteContext) {
  const res = await apolloHandler(req);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}
