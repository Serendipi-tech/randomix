import { GraphQLError } from 'graphql';
import { prisma } from './builder';
import type { Context } from './builder';

// Guard per query/mutation admin-only: obbligatorio perché l'endpoint GraphQL
// è condiviso con mobile e raggiungibile anche fuori dalle pagine web protette.
export async function requireAdmin(ctx: Context): Promise<string> {
  if (!ctx.userId) {
    throw new GraphQLError('Non autenticato.', { extensions: { code: 'UNAUTHENTICATED' } });
  }

  const user = await prisma.user.findUnique({
    where: { id: ctx.userId },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    throw new GraphQLError('Accesso riservato agli amministratori.', { extensions: { code: 'FORBIDDEN' } });
  }

  return ctx.userId;
}
