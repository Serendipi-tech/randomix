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
      createdAt
      sender {
        id
        username
        avatarUrl
      }
    }
  }
`);

export const SENT_FRIEND_REQUESTS: DocumentNode = parse(`
  query SentFriendRequests {
    sentFriendRequests {
      id
      createdAt
      receiver {
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
        items {
          id
          name
          note
          status
          category {
            id
            name
            icon
          }
        }
      }
      stats {
        categoryStats {
          categoryId
          name
          icon
          itemsCount
          drawCount
        }
        completionBreakdown {
          notStarted
          inProgress
          completed
        }
        drawAcceptance {
          accepted
          skipped
        }
      }
    }
  }
`);
