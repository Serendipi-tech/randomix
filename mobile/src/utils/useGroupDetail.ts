import { useMutation, useQuery } from '@apollo/client';
import { GroupMutations, GroupQueries } from '@randomix/graphql-schema';

const { GROUP_DETAIL } = GroupQueries;
const {
  INVITE_TO_GROUP,
  LEAVE_GROUP,
  REMOVE_GROUP_MEMBER,
  UPDATE_GROUP_MEMBER_ROLE,
  UPDATE_GROUP,
  CREATE_GROUP_LIST,
  DELETE_GROUP_LIST,
} = GroupMutations;

export interface GroupMember {
  id: string;
  userId: string;
  role: string;
  autoUpdateItems: boolean;
  user: { id: string; username: string; avatarUrl: string | null };
}

export interface GroupListSummary {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string | null;
  memberListCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  members: GroupMember[];
  groupLists: GroupListSummary[];
  createdAt: string;
  updatedAt: string;
}

interface GroupDetailQuery {
  groupDetail: GroupDetail;
}

export function useGroupDetail(groupId: string) {
  const { data, loading, error, refetch } = useQuery<GroupDetailQuery>(GROUP_DETAIL, {
    variables: { groupId },
    fetchPolicy: 'cache-and-network',
  });

  const [inviteMutate, { loading: inviting }] = useMutation(INVITE_TO_GROUP, {
    refetchQueries: ['GroupDetail'],
  });

  const [leaveMutate, { loading: leaving }] = useMutation(LEAVE_GROUP, {
    refetchQueries: ['MyGroups'],
  });

  const [removeMemberMutate, { loading: removingMember }] = useMutation(REMOVE_GROUP_MEMBER, {
    refetchQueries: ['GroupDetail'],
  });

  const [updateRoleMutate, { loading: updatingRole }] = useMutation(UPDATE_GROUP_MEMBER_ROLE, {
    refetchQueries: ['GroupDetail'],
  });

  const [updateGroupMutate, { loading: updatingGroup }] = useMutation(UPDATE_GROUP, {
    refetchQueries: ['GroupDetail', 'MyGroups'],
  });

  const [createGroupListMutate, { loading: creatingList }] = useMutation(CREATE_GROUP_LIST, {
    refetchQueries: ['GroupDetail'],
  });

  const [deleteGroupListMutate, { loading: deletingList }] = useMutation(DELETE_GROUP_LIST, {
    refetchQueries: ['GroupDetail'],
  });

  const inviteToGroup = (userId: string) => inviteMutate({ variables: { groupId, userId } });
  const leaveGroup = () => leaveMutate({ variables: { groupId } });
  const removeGroupMember = (userId: string) =>
    removeMemberMutate({ variables: { groupId, userId } });
  const updateMemberRole = (userId: string, role: string) =>
    updateRoleMutate({ variables: { groupId, userId, role } });
  const updateGroup = (name?: string, description?: string) =>
    updateGroupMutate({ variables: { groupId, name, description } });
  const createGroupList = (params: {
    name: string;
    icon: string;
    color: string;
    description?: string;
  }) => createGroupListMutate({ variables: { groupId, ...params } });
  const deleteGroupList = (groupListId: string) =>
    deleteGroupListMutate({ variables: { groupListId } });

  return {
    group: data?.groupDetail ?? null,
    loading,
    error: error ?? null,
    refetch,
    inviteToGroup,
    inviting,
    leaveGroup,
    leaving,
    removeGroupMember,
    removingMember,
    updateMemberRole,
    updatingRole,
    updateGroup,
    updatingGroup,
    createGroupList,
    creatingList,
    deleteGroupList,
    deletingList,
  };
}
