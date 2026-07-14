import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
// Disponibili solo dopo `prisma generate`
// Aggiungere allo schema: generator pothos { provider = "prisma-pothos-types" }
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { PrismaClient } from '../prisma/generated/prisma';

export const prisma = new PrismaClient();

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
  },
});
