import { useNotifications } from '@/utils/useNotifications';
import { useFriendRequests } from '@/utils/useFriendRequests';
import { useGroupInvites } from '@/utils/useGroupInvites';

/** Quante cose aspettano una risposta: notifiche non lette, richieste d'amicizia ricevute e inviti
 *  ai gruppi ricevuti. È lo stesso insieme che la pagina notifiche raccoglie nella sezione "new",
 *  perciò il pallino in navbar e quel conteggio non possono divergere. */
export function usePendingNotificationsCount(): number {
  const { notifications } = useNotifications();
  const { requests } = useFriendRequests();
  const { invites } = useGroupInvites();

  const unreadNotifications = notifications.filter((notification) => !notification.markedAsRead).length;

  return unreadNotifications + requests.length + invites.length;
}
