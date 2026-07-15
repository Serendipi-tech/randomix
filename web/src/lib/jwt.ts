import { jwtVerify, SignJWT } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.email) return null;
    return { userId: payload.sub, email: payload.email as string };
  } catch {
    return null;
  }
}
