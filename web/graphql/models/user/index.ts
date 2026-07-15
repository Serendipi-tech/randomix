import type { User } from '../../../prisma/generated/prisma/client';
import { builder } from '../../builder';
import { RolesEnum } from '../../enum';

export const UserRef = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    email: t.exposeString('email'),
    avatarUrl: t.exposeString('avatarUrl', { nullable: true }),
    language: t.exposeString('language', { nullable: true }),
    role: t.field({
      type: RolesEnum,
      resolve: (user) => user.role as 'ADMIN' | 'USER',
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});

interface AuthPayloadShape {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const AuthPayloadRef = builder.objectRef<AuthPayloadShape>('AuthPayload');

AuthPayloadRef.implement({
  fields: (t) => ({
    accessToken: t.exposeString('accessToken'),
    refreshToken: t.exposeString('refreshToken'),
    user: t.field({
      type: UserRef,
      resolve: (parent) => parent.user,
    }),
  }),
});
