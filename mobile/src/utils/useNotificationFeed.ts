import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FriendshipMutations, FriendshipQueries } from '@randomix/graphql-schema';
import { useNotifications } from '@/utils/useNotifications';
import { useFriendRequests } from '@/utils/useFriendRequests';
import { toRelativeTime, type RelativeTime } from '@/utils/relativeTime';

const { SENT_FRIEND_REQUESTS } = FriendshipQueries;
const { CANCEL_FRIEND_REQUEST } = FriendshipMutations;

/** Tab del feed: `system` tiene le notifiche generate dall'app, `friends` le richieste d'amicizia. */
export type NotificationFilter = 'all' | 'system' | 'friends';

export type FeedItemKind = 'notification' | 'friendRequest' | 'friendRequestSent';

export interface FeedUser {
  username: string;
  avatarUrl: string | null;
}

export interface FeedItem {
  id: string;
  kind: FeedItemKind;
  createdAt: string;
  relative: RelativeTime;
  unread: boolean;
  /** Valorizzati solo per `notification`: le richieste compongono il testo lato UI (i18n). */
  title?: string;
  body?: string | null;
  /** Valorizzato solo per le richieste d'amicizia. */
  user?: FeedUser;
}

/** `new`: cose su cui l'utente non è ancora intervenuto; `old`: già lette o in sola attesa. */
export type FeedSectionKey = 'new' | 'old';

export interface FeedSection {
  key: FeedSectionKey;
  data: FeedItem[];
}

interface SentFriendRequest {
  id: string;
  createdAt: string;
  receiver: FeedUser & { id: string };
}

interface SentFriendRequestsQuery {
  sentFriendRequests: SentFriendRequest[];
}

/** Feed unico della pagina notifiche: fonde notifiche di sistema, richieste d'amicizia ricevute e
 *  inviate, le ordina per data, le filtra per tab e le divide in "nuove" e "precedenti". */
export function useNotificationFeed() {
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const {
    notifications,
    loading: loadingNotifications,
    initialLoading: initialLoadingNotifications,
    error: notificationsError,
    markAsRead,
  } = useNotifications();
  const {
    requests,
    acceptRequest,
    rejectRequest,
    answering,
    loading: loadingRequests,
    initialLoading: initialLoadingRequests,
  } = useFriendRequests();
  const { data: sentData, loading: loadingSent } = useQuery<SentFriendRequestsQuery>(SENT_FRIEND_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  });
  const [cancelMutation, { loading: canceling }] = useMutation(CANCEL_FRIEND_REQUEST, {
    refetchQueries: ['SentFriendRequests'],
  });

  const sections = useMemo<FeedSection[]>(() => {
    const now = Date.now();

    const fromNotifications: FeedItem[] = notifications.map((notification) => ({
      id: notification.id,
      kind: 'notification',
      createdAt: notification.createdAt,
      relative: toRelativeTime(notification.createdAt, now),
      unread: !notification.markedAsRead,
      title: notification.title,
      body: notification.body,
    }));

    const fromRequests: FeedItem[] = requests.map((request) => ({
      id: request.id,
      kind: 'friendRequest',
      createdAt: request.createdAt,
      relative: toRelativeTime(request.createdAt, now),
      unread: true,
      user: request.sender,
    }));

    const fromSent: FeedItem[] = (sentData?.sentFriendRequests ?? []).map((request) => ({
      id: request.id,
      kind: 'friendRequestSent',
      createdAt: request.createdAt,
      relative: toRelativeTime(request.createdAt, now),
      unread: false,
      user: request.receiver,
    }));

    const all = [...fromNotifications, ...fromRequests, ...fromSent]
      .filter((item) => {
        if (filter === 'all') return true;
        if (filter === 'system') return item.kind === 'notification';
        return item.kind !== 'notification';
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
      [
        { key: 'new' as const, data: all.filter((item) => item.unread) },
        { key: 'old' as const, data: all.filter((item) => !item.unread) },
      ] satisfies FeedSection[]
    ).filter((section) => section.data.length > 0);
  }, [notifications, requests, sentData, filter]);

  return {
    filter,
    setFilter,
    sections,
    isEmpty: sections.length === 0,
    loading: loadingNotifications || loadingRequests || loadingSent,
    // Il feed fonde tre query: finché anche una sola non ha risposto resta lo skeleton, altrimenti
    // le richieste d'amicizia atterrerebbero dopo le notifiche spostando il layout
    initialLoading: initialLoadingNotifications || initialLoadingRequests || (loadingSent && !sentData),
    error: notificationsError,
    markAsRead,
    acceptRequest,
    rejectRequest,
    /** Ritira una richiesta inviata e ancora in sospeso. */
    cancelRequest: (id: string) => cancelMutation({ variables: { id } }),
    answering: answering || canceling,
  };
}
