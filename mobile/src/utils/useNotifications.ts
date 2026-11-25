import { useMutation, useQuery } from '@apollo/client';
import { NotificationMutations, NotificationQueries } from '@randomix/graphql-schema';

const { MY_NOTIFICATIONS } = NotificationQueries;
const { MARK_NOTIFICATION_AS_READ } = NotificationMutations;

export type NotificationType =
  | 'CHALLENGE_NEW'
  | 'CHALLENGE_COMPLETED'
  | 'CHALLENGE_FAILED'
  | 'FRIENDSHIP'
  | 'GROUP_AUTOCONTRIBUTOR'
  | 'SYSTEM';

interface NotificationSender {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string | null;
  notificationType: NotificationType;
  markedAsRead: boolean;
  sender: NotificationSender | null;
  timeLabel: string;
}

interface RawNotification {
  id: string;
  title: string;
  body: string | null;
  notificationType: NotificationType;
  markedAsRead: boolean;
  sender: NotificationSender | null;
  createdAt: string;
}

interface MyNotificationsQuery {
  myNotifications: RawNotification[];
}

function formatTimeLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

/** Notifiche personali (sistema, amicizia, gruppo escluso invite): query + segna-come-letta
 *  contro il backend reale (myNotifications/markNotificationAsRead). */
export function useNotifications() {
  const { data, loading, error, refetch } = useQuery<MyNotificationsQuery>(MY_NOTIFICATIONS, {
    fetchPolicy: 'cache-and-network',
  });

  const [markAsReadMutate] = useMutation(MARK_NOTIFICATION_AS_READ, {
    refetchQueries: ['MyNotifications'],
  });

  const notifications: AppNotification[] = (data?.myNotifications ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    notificationType: n.notificationType,
    markedAsRead: n.markedAsRead,
    sender: n.sender,
    timeLabel: formatTimeLabel(n.createdAt),
  }));

  const markAsRead = async (id: string) => {
    await markAsReadMutate({ variables: { id } });
  };

  const unreadCount = notifications.filter((n) => !n.markedAsRead).length;

  return {
    notifications,
    unreadCount,
    loading,
    error: error ?? null,
    markAsRead,
    refetch,
  };
}
