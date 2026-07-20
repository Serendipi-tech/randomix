import bcrypt from 'bcryptjs';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { createHash, randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '../../../src/lib/email';
import { GraphQLError } from 'graphql';
import { Prisma, User } from '../../../prisma/generated/prisma/client';
import { builder, prisma } from '../../builder';
import { signToken } from '../../../src/lib/jwt';
import { AuthPayloadRef } from './index';

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs'),
);

async function makeAuthPayload(user: User) {
  const accessToken = await signToken(user.id, user.email);
  const refreshToken = await signToken(user.id, user.email);
  return { accessToken, refreshToken, user };
}

builder.mutationField('registerWithCredentials', (t) =>
  t.field({
    type: AuthPayloadRef,
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      username: t.arg.string({ required: true }),
    },
    resolve: async (_root, { email, password, username }) => {
      const passwordHash = await bcrypt.hash(password, 12);
      try {
        const user = await prisma.user.create({ data: { email, username, passwordHash } });
        return makeAuthPayload(user);
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          throw new GraphQLError('Email or username already in use.', {
            extensions: { code: 'EMAIL_OR_USERNAME_TAKEN' },
          });
        }
        throw e;
      }
    },
  }),
);

builder.mutationField('loginWithCredentials', (t) =>
  t.field({
    type: AuthPayloadRef,
    args: {
      identifier: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_root, { identifier, password }) => {
      const user = await prisma.user.findFirst({
        where: { OR: [{ email: identifier }, { username: identifier }] },
      });
      if (!user?.passwordHash) {
        throw new GraphQLError('Invalid credentials.', { extensions: { code: 'INVALID_CREDENTIALS' } });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        throw new GraphQLError('Invalid credentials.', { extensions: { code: 'INVALID_CREDENTIALS' } });
      }
      return makeAuthPayload(user);
    },
  }),
);

builder.mutationField('loginWithGoogle', (t) =>
  t.field({
    type: AuthPayloadRef,
    args: { idToken: t.arg.string({ required: true }) },
    resolve: async (_root, { idToken }) => {
      let payload: Record<string, unknown>;
      try {
        const result = await jwtVerify(idToken, GOOGLE_JWKS, {
          issuer: ['https://accounts.google.com', 'accounts.google.com'],
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = result.payload as Record<string, unknown>;
      } catch {
        throw new GraphQLError('Invalid Google token.', { extensions: { code: 'INVALID_GOOGLE_TOKEN' } });
      }

      const email = payload.email as string;
      const name = payload.name as string | undefined;
      const picture = payload.picture as string | undefined;

      const user = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          username: name?.replace(/\s+/g, '').toLowerCase() ?? email.split('@')[0],
          avatarUrl: picture ?? null,
          passwordHash: await bcrypt.hash(randomBytes(32).toString('hex'), 12),
        },
        update: { avatarUrl: picture ?? undefined },
      });

      return makeAuthPayload(user);
    },
  }),
);

builder.mutationField('requestPasswordReset', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      email: t.arg.string({ required: true }),
    },
    resolve: async (_root, { email }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return true; // nessuna info leak sull'esistenza dell'account

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const tokenHash = createHash('sha256').update(otp).digest('hex');
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { email },
        data: { resetPasswordToken: tokenHash, resetPasswordTokenExpiry: expiry },
      });

      await sendPasswordResetEmail(email, otp, user.language);
      return true;
    },
  }),
);

builder.mutationField('resetPassword', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      email: t.arg.string({ required: true }),
      otp: t.arg.string({ required: true }),
      newPassword: t.arg.string({ required: true }),
    },
    resolve: async (_root, { email, otp, newPassword }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      const tokenHash = createHash('sha256').update(otp).digest('hex');

      if (
        !user?.resetPasswordToken ||
        !user.resetPasswordTokenExpiry ||
        user.resetPasswordTokenExpiry < new Date() ||
        tokenHash !== user.resetPasswordToken
      ) {
        throw new GraphQLError('Invalid or expired code.', {
          extensions: { code: 'INVALID_OTP' },
        });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { email },
        data: { passwordHash, resetPasswordToken: null, resetPasswordTokenExpiry: null },
      });

      return true;
    },
  }),
);

builder.mutationField('logout', (t) =>
  t.field({
    type: 'Boolean',
    // Il client rimuove il token localmente — nessuna sessione server-side da invalidare
    resolve: () => true,
  }),
);
