import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const MY_FRIENDS: DocumentNode = parse(`
  query MyFriends {
    myFriends {
      id
      username
      avatarUrl
    }
  }
`);

export const FRIEND_REQUESTS: DocumentNode = parse(`
  query FriendRequests {
    friendRequests {
      id
      sender {
        id
        username
        avatarUrl
      }
    }
  }
`);

export const SEARCH_USERS: DocumentNode = parse(`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      user {
        id
        username
        avatarUrl
      }
      relation
    }
  }
`);

export const FRIEND_PROFILE: DocumentNode = parse(`
  query FriendProfile($userId: ID!) {
    friendProfile(userId: $userId) {
      user {
        id
        username
        avatarUrl
      }
      lists {
        id
        name
        icon
        color
        description
        itemCount
      }
    }
  }
`);
