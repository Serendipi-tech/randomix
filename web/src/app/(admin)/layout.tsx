import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { execute } from 'graphql';
import { UserQueries } from '@randomix/graphql-schema';
import { schema } from '@graphql/schema';
import { verifyToken } from '@/lib/jwt';
import { ADMIN_SESSION_COOKIE } from '@/lib/session';
import { AdminProviders } from './providers';
import { Sidebar } from '@/components/organisms/Sidebar';

interface MePayload {
  role: string;
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    redirect('/login');
  }

  const result = await execute({
    schema,
    document: UserQueries.ME,
    contextValue: { userId: payload.userId },
  });

  const me = result.data?.me as MePayload | null | undefined;

  if (me?.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <AdminProviders>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </AdminProviders>
  );
}
