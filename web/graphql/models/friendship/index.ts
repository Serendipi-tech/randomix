import type { User } from '../../../prisma/generated/prisma/client';
import { builder } from '../../builder';

// Profilo pubblico di un altro utente: mai esporre email o campi sensibili
export const PublicUserRef = builder.objectRef<User>('PublicUser');

PublicUserRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    avatarUrl: t.exposeString('avatarUrl', { nullable: true }),
  }),
});
