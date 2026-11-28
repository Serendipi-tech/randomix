import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { FriendshipMutations, FriendshipQueries, GroupMutations, GroupQueries } from '@randomix/graphql-schema';
import { useNotifications, type NotificationType } from '@/utils/useNotifications';
import { useFriendRequests } from '@/utils/useFriendRequests';
import { useGroupInvites } from '@/utils/useGroupInvites';
import { toRelativeTime, type RelativeTime } from '@/utils/relativeTime';

const { ANSWERED_FRIEND_REQUESTS, SENT_FRIEND_REQUESTS } = FriendshipQueries;
const { CANCEL_FRIEND_REQUEST } = FriendshipMutations;
const { ANSWERED_GROUP_INVITES, SENT_GROUP_INVITES } = GroupQueries;
const { REVOKE_GROUP_INVITE } = GroupMutations;

/** Tab del feed: `system` tiene le notifiche generate dall'app, `friends` le richieste d'amicizia,
 *  `groups` gli inviti ai gruppi. */
export type NotificationFilter = 'all' | 'system' | 'friends' | 'groups';

export type FeedItemKind =
  | 'notification'
  | 'friendRequest'
  | 'friendRequestSent'
  | 'friendRequestAnswered'
  | 'groupInvite'
  | 'groupInviteSent'
  | 'groupInviteAnswered';

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
  /** Solo per `notification`: distingue le notifiche di sistema, che hanno una pagina propria. */
  notificationType?: NotificationType;
  /** Valorizzato per le richieste d'amicizia e per gli inviti ai gruppi: la persona coinvolta. */
  user?: FeedUser;
  /** Valorizzato solo per gli inviti ai gruppi. */
  group?: { id: string; name: string };
  /** Id della persona invitata: serve a revocare un invito inviato (la revoca va per gruppo+utente). */
  targetUserId?: string;
  /** Esito di una richiesta o di un invito a cui si è già risposto. */
  accepted?: boolean;
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

interface SentGroupInvite {
  id: string;
  groupId: string;
  groupName: string;
  createdAt: string;
  receiver: FeedUser & { id: string };
}

interface SentGroupInvitesQuery {
  sentGroupInvites: SentGroupInvite[];
}

interface AnsweredFriendRequest {
  id: string;
  accepted: boolean;
  answeredAt: string;
  sender: FeedUser;
}

interface AnsweredFriendRequestsQuery {
  answeredFriendRequests: AnsweredFriendRequest[];
}

interface AnsweredGroupInvite {
  id: string;
  groupId: string;
  groupName: string;
  accepted: boolean;
  answeredAt: string;
  sender: FeedUser;
}

interface AnsweredGroupInvitesQuery {
  answeredGroupInvites: AnsweredGroupInvite[];
}

/** Feed unico della pagina notifiche: fonde notifiche di sistema, richieste d'amicizia e inviti ai
 *  gruppi (ricevuti e inviati), li ordina per data, li filtra per tab e li divide in "nuovi" e
 *  "precedenti". */
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

  const {
    invites: groupInvites,
    acceptInvite,
    rejectInvite,
    answering: answeringInvites,
    loading: loadingInvites,
  } = useGroupInvites();
  const { data: sentInvitesData, loading: loadingSentInvites } = useQuery<SentGroupInvitesQuery>(
    SENT_GROUP_INVITES,
    { fetchPolicy: 'cache-and-network' },
  );
  const [revokeMutation, { loading: revoking }] = useMutation(REVOKE_GROUP_INVITE, {
    refetchQueries: ['SentGroupInvites'],
  });

  // Voci storiche: una richiesta o un invito a cui si è risposto non sparisce, scende in "old"
  const { data: answeredRequestsData } = useQuery<AnsweredFriendRequestsQuery>(ANSWERED_FRIEND_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: answeredInvitesData } = useQuery<AnsweredGroupInvitesQuery>(ANSWERED_GROUP_INVITES, {
    fetchPolicy: 'cache-and-network',
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
      notificationType: notification.notificationType,
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

    const fromInvites: FeedItem[] = groupInvites.map((invite) => ({
      id: invite.id,
      kind: 'groupInvite',
      createdAt: invite.createdAt,
      relative: toRelativeTime(invite.createdAt, now),
      unread: true,
      user: invite.sender,
      group: { id: invite.groupId, name: invite.groupName },
    }));

    const fromSentInvites: FeedItem[] = (sentInvitesData?.sentGroupInvites ?? []).map((invite) => ({
      id: invite.id,
      kind: 'groupInviteSent',
      createdAt: invite.createdAt,
      relative: toRelativeTime(invite.createdAt, now),
      unread: false,
      user: invite.receiver,
      group: { id: invite.groupId, name: invite.groupName },
      targetUserId: invite.receiver.id,
    }));

    const fromAnsweredRequests: FeedItem[] = (answeredRequestsData?.answeredFriendRequests ?? []).map(
      (request) => ({
        id: request.id,
        kind: 'friendRequestAnswered',
        createdAt: request.answeredAt,
        relative: toRelativeTime(request.answeredAt, now),
        unread: false,
        user: request.sender,
        accepted: request.accepted,
      }),
    );

    const fromAnsweredInvites: FeedItem[] = (answeredInvitesData?.answeredGroupInvites ?? []).map(
      (invite) => ({
        id: invite.id,
        kind: 'groupInviteAnswered',
        createdAt: invite.answeredAt,
        relative: toRelativeTime(invite.answeredAt, now),
        unread: false,
        user: invite.sender,
        group: { id: invite.groupId, name: invite.groupName },
        accepted: invite.accepted,
      }),
    );

    const all = [
      ...fromNotifications,
      ...fromRequests,
      ...fromSent,
      ...fromInvites,
      ...fromSentInvites,
      ...fromAnsweredRequests,
      ...fromAnsweredInvites,
    ]
      .filter((item) => {
        if (filter === 'all') return true;
        if (filter === 'system') return item.kind === 'notification';
        if (filter === 'groups') return item.kind.startsWith('groupInvite');
        return item.kind.startsWith('friendRequest');
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
      [
        { key: 'new' as const, data: all.filter((item) => item.unread) },
        { key: 'old' as const, data: all.filter((item) => !item.unread) },
      ] satisfies FeedSection[]
    ).filter((section) => section.data.length > 0);
  }, [
    notifications,
    requests,
    sentData,
    groupInvites,
    sentInvitesData,
    answeredRequestsData,
    answeredInvitesData,
    filter,
  ]);

  return {
    filter,
    setFilter,
    sections,
    isEmpty: sections.length === 0,
    loading: loadingNotifications || loadingRequests || loadingSent || loadingInvites || loadingSentInvites,
    // Il feed fonde tre query: finché anche una sola non ha risposto resta lo skeleton, altrimenti
    // le richieste d'amicizia atterrerebbero dopo le notifiche spostando il layout
    initialLoading:
      initialLoadingNotifications ||
      initialLoadingRequests ||
      (loadingSent && !sentData) ||
      (loadingSentInvites && !sentInvitesData),
    error: notificationsError,
    markAsRead,
    acceptRequest,
    rejectRequest,
    /** Ritira una richiesta inviata e ancora in sospeso. */
    cancelRequest: (id: string) => cancelMutation({ variables: { id } }),
    acceptInvite,
    rejectInvite,
    /** Ritira un invito a un gruppo: la revoca lato server va per gruppo + destinatario. */
    cancelInvite: (groupId: string, userId: string) => revokeMutation({ variables: { groupId, userId } }),
    answering: answering || canceling || answeringInvites || revoking,
  };
}
