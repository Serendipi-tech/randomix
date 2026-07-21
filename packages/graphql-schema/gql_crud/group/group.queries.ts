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

export const GROUP_LIST_MERGED_ITEMS: DocumentNode = parse(`
  query GroupListMergedItems($groupListId: ID!) {
    groupListMergedItems(groupListId: $groupListId) {
      id
      name
      description
      imageUrl
      category
    }
  }
`);

export const GROUP_LIST_SHARED_LIST_IDS: DocumentNode = parse(`
  query GroupListSharedListIds($groupListId: ID!) {
    groupListSharedListIds(groupListId: $groupListId)
  }
`);
