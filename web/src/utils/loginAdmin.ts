'use server';

import { execute } from 'graphql';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserMutations } from '@randomix/graphql-schema';
import { schema } from '@graphql/schema';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from '@/lib/session';

export interface LoginAdminState {
  error?: string;
}

interface LoginWithCredentialsPayload {
  accessToken: string;
  user: { role: string };
}

export async function loginAdmin(_prevState: LoginAdminState, formData: FormData): Promise<LoginAdminState> {
  const identifier = String(formData.get('identifier') ?? '');
  const password = String(formData.get('password') ?? '');

  const result = await execute({
    schema,
    document: UserMutations.LOGIN_WITH_CREDENTIALS,
    variableValues: { identifier, password },
    contextValue: { userId: null },
  });

  if (result.errors?.length) {
    return { error: 'Credenziali non valide.' };
  }

  const payload = result.data?.loginWithCredentials as LoginWithCredentialsPayload | undefined;

  if (!payload || payload.user.role !== 'ADMIN') {
    return { error: 'Accesso riservato agli amministratori.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, payload.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  });

  redirect('/dashboard');
}
