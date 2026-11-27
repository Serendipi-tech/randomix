import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { PrismaClient } from '../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type PrismaTypes from './generated/pothos-types';
import { getDatamodel } from './generated/pothos-types';

export interface Context {
  userId: string | null;
}

// Il pooler Supabase sulla 5432 è in session mode: accetta 15 client in tutto e li tiene occupati per
// l'intera connessione, quindi basta qualche istanza serverless calda per esaurirlo (EMAXCONNSESSION).
// La 6543 dello stesso host è il transaction mode, pensato per il serverless: multiplexa molti client
// su poche connessioni server. La riscrittura sta qui, e non nella variabile d'ambiente, solo perché le
// env di produzione non sono modificabili da chi lavora al codice: vedi docs/ERRORI-APERTI.md (E09),
// il posto giusto resta DATABASE_URL.
// Compatibile con il driver `pg`, che non usa prepared statement con nome; il transaction mode non
// supporta però le transazioni interattive (`$transaction` con callback), oggi non usate nei resolver.
function toTransactionPooler(url: string): string {
  return url.replace(/(\.pooler\.supabase\.com):5432\//, '$1:6543/');
}

// Anche in transaction mode ogni istanza tiene poche connessioni e le rilascia appena restano inattive,
// invece delle 10 di default di node-postgres.
const adapter = new PrismaPg({
  connectionString: toTransactionPooler(process.env.DATABASE_URL!),
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
