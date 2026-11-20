import type { Notification, User } from '../../../prisma/generated/prisma/client';
import { builder } from '../../builder';
import { NotificationTypeEnum } from '../../enum';
import { PublicUserRef } from '../friendship/index';

export type NotificationShape = Notification & { sender: User | null };

export const NotificationRef = builder.objectRef<NotificationShape>('Notification');

NotificationRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    body: t.exposeString('body', { nullable: true }),
    notificationType: t.field({ type: NotificationTypeEnum, resolve: (n) => n.notificationType }),
    markedAsRead: t.exposeBoolean('markedAsRead'),
    sender: t.field({ type: PublicUserRef, nullable: true, resolve: (n) => n.sender }),
    createdAt: t.field({ type: 'DateTime', resolve: (n) => n.createdAt }),
  }),
});
