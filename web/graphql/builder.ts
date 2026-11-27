import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { PrismaClient } from '../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type PrismaTypes from './generated/pothos-types';
import { getDatamodel } from './generated/pothos-types';

export interface Context {
  userId: string | null;
}

// Il pooler Supabase in session mode accetta in tutto 15 client: il default di node-postgres (10 per
// pool) basta a saturarlo con due istanze serverless calde. Qui ogni istanza ne tiene al massimo 3 e
// le rilascia appena restano inattive, così le connessioni tornano disponibili fra un'invocazione e
// l'altra invece di restare appese.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 3,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

// In dev Next ricarica i moduli a ogni salvataggio: senza singleton ogni hot-reload lascerebbe dietro
// un client con le sue connessioni ancora aperte, ed è così che il pool si esaurisce in locale.
const globalForPrisma = globalThis as unknown as { prismaClient?: PrismaClient };

export const prisma = globalForPrisma.prismaClient ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaClient = prisma;
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
});

builder.scalarType('DateTime', {
  serialize: (value) => (value instanceof Date ? value.toISOString() : String(value)),
  parseValue: (value) => new Date(String(value)),
});
