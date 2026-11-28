import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const MY_GROUPS: DocumentNode = parse(`
  query MyGroups {
    myGroups {
      id
      name
      description
      ownerId
      memberCount
      myRole
      createdAt
      updatedAt
    }
  }
`);

export const GROUP_DETAIL: DocumentNode = parse(`
  query GroupDetail($groupId: ID!) {
    groupDetail(groupId: $groupId) {
      id
      name
      description
      ownerId
      createdAt
      updatedAt
      members {
        id
        userId
        role
        autoUpdateItems
        user {
          id
          username
          avatarUrl
        }
      }
      groupLists {
        id
        name
        icon
        color
        description
        memberListCount
        createdAt
        updatedAt
      }
      pendingInvites {
        userId
        username
      }
    }
  }
`);

export const MY_GROUP_INVITES: DocumentNode = parse(`
  query MyGroupInvites {
    myGroupInvites {
      id
      groupId
      groupName
      sender {
        id
        username
        avatarUrl
      }
      createdAt
    }
  }
`);

export const SENT_GROUP_INVITES: DocumentNode = parse(`
  query SentGroupInvites {
    sentGroupInvites {
      id
      groupId
      groupName
      receiver {
        id
        username
        avatarUrl
      }
      createdAt
    }
  }
`);

// Disabilitato insieme a Item lato server (groupListMergedItems commentato in group.queries.ts):
// il merge deduplicava item condivisi tra membri, concetto che non esiste più con item personali.
// export const GROUP_LIST_MERGED_ITEMS: DocumentNode = parse(`
//   query GroupListMergedItems($groupListId: ID!) {
//     groupListMergedItems(groupListId: $groupListId) {
//       id
//       name
//       description
//       imageUrl
//       category
//     }
//   }
// `);

export const GROUP_LIST_SHARED_LIST_IDS: DocumentNode = parse(`
  query GroupListSharedListIds($groupListId: ID!) {
    groupListSharedListIds(groupListId: $groupListId)
  }
`);

export const ANSWERED_GROUP_INVITES: DocumentNode = parse(`
  query AnsweredGroupInvites {
    answeredGroupInvites {
      id
      groupId
      groupName
      accepted
      answeredAt
      sender {
        id
        username
        avatarUrl
      }
    }
  }
`);
