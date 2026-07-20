import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const CREATE_GROUP: DocumentNode = parse(`
  mutation CreateGroup($name: String!, $description: String) {
    createGroup(name: $name, description: $description) {
      id
      name
      description
      ownerId
      members {
        id
        userId
        role
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
      }
    }
  }
`);

export const UPDATE_GROUP: DocumentNode = parse(`
  mutation UpdateGroup($groupId: ID!, $name: String, $description: String) {
    updateGroup(groupId: $groupId, name: $name, description: $description) {
      id
      name
      description
    }
  }
`);

export const DELETE_GROUP: DocumentNode = parse(`
  mutation DeleteGroup($groupId: ID!) {
    deleteGroup(groupId: $groupId)
  }
`);

export const INVITE_TO_GROUP: DocumentNode = parse(`
  mutation InviteToGroup($groupId: ID!, $userId: ID!) {
    inviteToGroup(groupId: $groupId, userId: $userId)
  }
`);

export const ACCEPT_GROUP_INVITE: DocumentNode = parse(`
  mutation AcceptGroupInvite($notificationId: ID!) {
    acceptGroupInvite(notificationId: $notificationId)
  }
`);

export const REJECT_GROUP_INVITE: DocumentNode = parse(`
  mutation RejectGroupInvite($notificationId: ID!) {
    rejectGroupInvite(notificationId: $notificationId)
  }
`);

export const LEAVE_GROUP: DocumentNode = parse(`
  mutation LeaveGroup($groupId: ID!) {
    leaveGroup(groupId: $groupId)
  }
`);

export const REMOVE_GROUP_MEMBER: DocumentNode = parse(`
  mutation RemoveGroupMember($groupId: ID!, $userId: ID!) {
    removeGroupMember(groupId: $groupId, userId: $userId)
  }
`);

export const UPDATE_GROUP_MEMBER_ROLE: DocumentNode = parse(`
  mutation UpdateGroupMemberRole($groupId: ID!, $userId: ID!, $role: ROLES_GROUP!) {
    updateGroupMemberRole(groupId: $groupId, userId: $userId, role: $role)
  }
`);

export const CREATE_GROUP_LIST: DocumentNode = parse(`
  mutation CreateGroupList($groupId: ID!, $name: String!, $icon: String!, $color: String!, $description: String) {
    createGroupList(groupId: $groupId, name: $name, icon: $icon, color: $color, description: $description) {
      id
      name
      icon
      color
      description
      memberListCount
    }
  }
`);

export const DELETE_GROUP_LIST: DocumentNode = parse(`
  mutation DeleteGroupList($groupListId: ID!) {
    deleteGroupList(groupListId: $groupListId)
  }
`);

export const ADD_LIST_TO_GROUP_LIST: DocumentNode = parse(`
  mutation AddListToGroupList($groupListId: ID!, $listId: ID!) {
    addListToGroupList(groupListId: $groupListId, listId: $listId)
  }
`);

export const REMOVE_LIST_FROM_GROUP_LIST: DocumentNode = parse(`
  mutation RemoveListFromGroupList($groupListId: ID!, $listId: ID!) {
    removeListFromGroupList(groupListId: $groupListId, listId: $listId)
  }
`);

export const DRAW_FROM_GROUP_LIST: DocumentNode = parse(`
  mutation DrawFromGroupList($groupListId: ID!, $previousItemId: ID) {
    drawFromGroupList(groupListId: $groupListId, previousItemId: $previousItemId) {
      id
      name
      description
      imageUrl
      category
    }
  }
`);

export const ACCEPT_GROUP_DRAW: DocumentNode = parse(`
  mutation AcceptGroupDraw($groupListId: ID!, $itemId: ID!) {
    acceptGroupDraw(groupListId: $groupListId, itemId: $itemId)
  }
`);
