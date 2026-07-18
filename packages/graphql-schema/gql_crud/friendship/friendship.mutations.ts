import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const SEND_FRIEND_REQUEST: DocumentNode = parse(`
  mutation SendFriendRequest($userId: ID!) {
    sendFriendRequest(userId: $userId)
  }
`);

export const ACCEPT_FRIEND_REQUEST: DocumentNode = parse(`
  mutation AcceptFriendRequest($id: ID!) {
    acceptFriendRequest(id: $id)
  }
`);

export const REJECT_FRIEND_REQUEST: DocumentNode = parse(`
  mutation RejectFriendRequest($id: ID!) {
    rejectFriendRequest(id: $id)
  }
`);

export const REMOVE_FRIEND: DocumentNode = parse(`
  mutation RemoveFriend($userId: ID!) {
    removeFriend(userId: $userId)
  }
`);
