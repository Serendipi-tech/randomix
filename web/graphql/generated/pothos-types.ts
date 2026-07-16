/* eslint-disable */
import type { Prisma, Group, Group_User, GroupList, GroupList_AcceptedItemHistory, GroupChallenge, GroupUser_Challenge, Item, User_Item, List, List_UserItem, ListCategory, Membership, Notification, Payment, Rating, Report, Subscription, Tag, User, Friendship } from "C:\\Personal\\Doc\\Lorenzo\\Codec\\Project\\Serendipitech\\randomix\\web\\prisma\\generated\\prisma/client.js";
import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";
export default interface PrismaTypes {
    Group: {
        Name: "Group";
        Shape: Group;
        Include: Prisma.GroupInclude;
        Select: Prisma.GroupSelect;
        OrderBy: Prisma.GroupOrderByWithRelationInput;
        WhereUnique: Prisma.GroupWhereUniqueInput;
        Where: Prisma.GroupWhereInput;
        Create: {};
        Update: {};
        RelationName: "owner" | "members" | "groupLists" | "groupChallenges" | "notification" | "report";
        ListRelations: "members" | "groupLists" | "groupChallenges" | "notification" | "report";
        Relations: {
            owner: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            members: {
                Shape: Group_User[];
                Name: "Group_User";
                Nullable: false;
            };
            groupLists: {
                Shape: GroupList[];
                Name: "GroupList";
                Nullable: false;
            };
            groupChallenges: {
                Shape: GroupChallenge[];
                Name: "GroupChallenge";
                Nullable: false;
            };
            notification: {
                Shape: Notification[];
                Name: "Notification";
                Nullable: false;
            };
            report: {
                Shape: Report[];
                Name: "Report";
                Nullable: false;
            };
        };
    };
    Group_User: {
        Name: "Group_User";
        Shape: Group_User;
        Include: Prisma.Group_UserInclude;
        Select: Prisma.Group_UserSelect;
        OrderBy: Prisma.Group_UserOrderByWithRelationInput;
        WhereUnique: Prisma.Group_UserWhereUniqueInput;
        Where: Prisma.Group_UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "group" | "user" | "groupUserProgression" | "groupListAcceptedItemHistory";
        ListRelations: "groupUserProgression" | "groupListAcceptedItemHistory";
        Relations: {
            group: {
                Shape: Group;
                Name: "Group";
                Nullable: false;
            };
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            groupUserProgression: {
                Shape: GroupUser_Challenge[];
                Name: "GroupUser_Challenge";
                Nullable: false;
            };
            groupListAcceptedItemHistory: {
                Shape: GroupList_AcceptedItemHistory[];
                Name: "GroupList_AcceptedItemHistory";
                Nullable: false;
            };
        };
    };
    GroupList: {
        Name: "GroupList";
        Shape: GroupList;
        Include: Prisma.GroupListInclude;
        Select: Prisma.GroupListSelect;
        OrderBy: Prisma.GroupListOrderByWithRelationInput;
        WhereUnique: Prisma.GroupListWhereUniqueInput;
        Where: Prisma.GroupListWhereInput;
        Create: {};
        Update: {};
        RelationName: "creator" | "group" | "memberLists" | "items" | "listCategories" | "connectedChallenges" | "acceptedItemsHistory";
        ListRelations: "memberLists" | "items" | "listCategories" | "connectedChallenges" | "acceptedItemsHistory";
        Relations: {
            creator: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
            group: {
                Shape: Group;
                Name: "Group";
                Nullable: false;
            };
            memberLists: {
                Shape: List[];
                Name: "List";
                Nullable: false;
            };
            items: {
                Shape: Item[];
                Name: "Item";
                Nullable: false;
            };
            listCategories: {
                Shape: ListCategory[];
                Name: "ListCategory";
                Nullable: false;
            };
            connectedChallenges: {
                Shape: GroupChallenge[];
                Name: "GroupChallenge";
                Nullable: false;
            };
            acceptedItemsHistory: {
                Shape: GroupList_AcceptedItemHistory[];
                Name: "GroupList_AcceptedItemHistory";
                Nullable: false;
            };
        };
    };
    GroupList_AcceptedItemHistory: {
        Name: "GroupList_AcceptedItemHistory";
        Shape: GroupList_AcceptedItemHistory;
        Include: Prisma.GroupList_AcceptedItemHistoryInclude;
        Select: Prisma.GroupList_AcceptedItemHistorySelect;
        OrderBy: Prisma.GroupList_AcceptedItemHistoryOrderByWithRelationInput;
        WhereUnique: Prisma.GroupList_AcceptedItemHistoryWhereUniqueInput;
        Where: Prisma.GroupList_AcceptedItemHistoryWhereInput;
        Create: {};
        Update: {};
        RelationName: "groupList" | "randomizingFor" | "item";
        ListRelations: "randomizingFor";
        Relations: {
            groupList: {
                Shape: GroupList;
                Name: "GroupList";
                Nullable: false;
            };
            randomizingFor: {
                Shape: Group_User[];
                Name: "Group_User";
                Nullable: false;
            };
            item: {
                Shape: Item;
                Name: "Item";
                Nullable: false;
            };
        };
    };
    GroupChallenge: {
        Name: "GroupChallenge";
        Shape: GroupChallenge;
        Include: Prisma.GroupChallengeInclude;
        Select: Prisma.GroupChallengeSelect;
        OrderBy: Prisma.GroupChallengeOrderByWithRelationInput;
        WhereUnique: Prisma.GroupChallengeWhereUniqueInput;
        Where: Prisma.GroupChallengeWhereInput;
        Create: {};
        Update: {};
        RelationName: "group" | "item" | "allowedLists" | "allowedTags" | "groupUserProgression" | "notification" | "report";
        ListRelations: "item" | "allowedLists" | "allowedTags" | "groupUserProgression" | "notification" | "report";
        Relations: {
            group: {
                Shape: Group;
                Name: "Group";
                Nullable: false;
            };
            item: {
                Shape: Item[];
                Name: "Item";
                Nullable: false;
            };
            allowedLists: {
                Shape: GroupList[];
                Name: "GroupList";
                Nullable: false;
            };
            allowedTags: {
                Shape: Tag[];
                Name: "Tag";
                Nullable: false;
            };
            groupUserProgression: {
                Shape: GroupUser_Challenge[];
                Name: "GroupUser_Challenge";
                Nullable: false;
            };
            notification: {
                Shape: Notification[];
                Name: "Notification";
                Nullable: false;
            };
            report: {
                Shape: Report[];
                Name: "Report";
                Nullable: false;
            };
        };
    };
    GroupUser_Challenge: {
        Name: "GroupUser_Challenge";
        Shape: GroupUser_Challenge;
        Include: Prisma.GroupUser_ChallengeInclude;
        Select: Prisma.GroupUser_ChallengeSelect;
        OrderBy: Prisma.GroupUser_ChallengeOrderByWithRelationInput;
        WhereUnique: Prisma.GroupUser_ChallengeWhereUniqueInput;
        Where: Prisma.GroupUser_ChallengeWhereInput;
        Create: {};
        Update: {};
        RelationName: "itemsForChallenge" | "group" | "challenge";
        ListRelations: "itemsForChallenge";
        Relations: {
            itemsForChallenge: {
                Shape: User_Item[];
                Name: "User_Item";
                Nullable: false;
            };
            group: {
                Shape: Group_User;
                Name: "Group_User";
                Nullable: false;
            };
            challenge: {
                Shape: GroupChallenge;
                Name: "GroupChallenge";
                Nullable: false;
            };
        };
    };
    Item: {
        Name: "Item";
        Shape: Item;
        Include: Prisma.ItemInclude;
        Select: Prisma.ItemSelect;
        OrderBy: Prisma.ItemOrderByWithRelationInput;
        WhereUnique: Prisma.ItemWhereUniqueInput;
        Where: Prisma.ItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "userItems" | "ratings" | "groupLists" | "challenges" | "acceptedItemsHistory";
        ListRelations: "userItems" | "ratings" | "groupLists" | "challenges" | "acceptedItemsHistory";
        Relations: {
            userItems: {
                Shape: User_Item[];
                Name: "User_Item";
                Nullable: false;
            };
            ratings: {
                Shape: Rating[];
                Name: "Rating";
                Nullable: false;
            };
            groupLists: {
                Shape: GroupList[];
                Name: "GroupList";
                Nullable: false;
            };
            challenges: {
                Shape: GroupChallenge[];
                Name: "GroupChallenge";
                Nullable: false;
            };
            acceptedItemsHistory: {
                Shape: GroupList_AcceptedItemHistory[];
                Name: "GroupList_AcceptedItemHistory";
                Nullable: false;
            };
        };
    };
    User_Item: {
        Name: "User_Item";
        Shape: User_Item;
        Include: Prisma.User_ItemInclude;
        Select: Prisma.User_ItemSelect;
        OrderBy: Prisma.User_ItemOrderByWithRelationInput;
        WhereUnique: Prisma.User_ItemWhereUniqueInput;
        Where: Prisma.User_ItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "tags" | "lists" | "usedInChallenge" | "user" | "item";
        ListRelations: "tags" | "lists" | "usedInChallenge";
        Relations: {
            tags: {
                Shape: Tag[];
                Name: "Tag";
                Nullable: false;
            };
            lists: {
                Shape: List_UserItem[];
                Name: "List_UserItem";
                Nullable: false;
            };
            usedInChallenge: {
                Shape: GroupUser_Challenge[];
                Name: "GroupUser_Challenge";
                Nullable: false;
            };
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            item: {
                Shape: Item;
                Name: "Item";
                Nullable: false;
            };
        };
    };
    List: {
        Name: "List";
        Shape: List;
        Include: Prisma.ListInclude;
        Select: Prisma.ListSelect;
        OrderBy: Prisma.ListOrderByWithRelationInput;
        WhereUnique: Prisma.ListWhereUniqueInput;
        Where: Prisma.ListWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "categories" | "items" | "groupLists";
        ListRelations: "categories" | "items" | "groupLists";
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            categories: {
                Shape: ListCategory[];
                Name: "ListCategory";
                Nullable: false;
            };
            items: {
                Shape: List_UserItem[];
                Name: "List_UserItem";
                Nullable: false;
            };
            groupLists: {
                Shape: GroupList[];
                Name: "GroupList";
                Nullable: false;
            };
        };
    };
    List_UserItem: {
        Name: "List_UserItem";
        Shape: List_UserItem;
        Include: Prisma.List_UserItemInclude;
        Select: Prisma.List_UserItemSelect;
        OrderBy: Prisma.List_UserItemOrderByWithRelationInput;
        WhereUnique: Prisma.List_UserItemWhereUniqueInput;
        Where: Prisma.List_UserItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "list" | "userItem";
        ListRelations: never;
        Relations: {
            list: {
                Shape: List;
                Name: "List";
                Nullable: false;
            };
            userItem: {
                Shape: User_Item;
                Name: "User_Item";
                Nullable: false;
            };
        };
    };
    ListCategory: {
        Name: "ListCategory";
        Shape: ListCategory;
        Include: Prisma.ListCategoryInclude;
        Select: Prisma.ListCategorySelect;
        OrderBy: Prisma.ListCategoryOrderByWithRelationInput;
        WhereUnique: Prisma.ListCategoryWhereUniqueInput;
        Where: Prisma.ListCategoryWhereInput;
        Create: {};
        Update: {};
        RelationName: "lists" | "groupLists";
        ListRelations: "lists" | "groupLists";
        Relations: {
            lists: {
                Shape: List[];
                Name: "List";
                Nullable: false;
            };
            groupLists: {
                Shape: GroupList[];
                Name: "GroupList";
                Nullable: false;
            };
        };
    };
    Membership: {
        Name: "Membership";
        Shape: Membership;
        Include: Prisma.MembershipInclude;
        Select: Prisma.MembershipSelect;
        OrderBy: Prisma.MembershipOrderByWithRelationInput;
        WhereUnique: Prisma.MembershipWhereUniqueInput;
        Where: Prisma.MembershipWhereInput;
        Create: {};
        Update: {};
        RelationName: "subscriptions";
        ListRelations: "subscriptions";
        Relations: {
            subscriptions: {
                Shape: Subscription[];
                Name: "Subscription";
                Nullable: false;
            };
        };
    };
    Notification: {
        Name: "Notification";
        Shape: Notification;
        Include: Prisma.NotificationInclude;
        Select: Prisma.NotificationSelect;
        OrderBy: Prisma.NotificationOrderByWithRelationInput;
        WhereUnique: Prisma.NotificationWhereUniqueInput;
        Where: Prisma.NotificationWhereInput;
        Create: {};
        Update: {};
        RelationName: "sender" | "receiver" | "group" | "challenge";
        ListRelations: never;
        Relations: {
            sender: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
            receiver: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            group: {
                Shape: Group | null;
                Name: "Group";
                Nullable: true;
            };
            challenge: {
                Shape: GroupChallenge | null;
                Name: "GroupChallenge";
                Nullable: true;
            };
        };
    };
    Payment: {
        Name: "Payment";
        Shape: Payment;
        Include: Prisma.PaymentInclude;
        Select: Prisma.PaymentSelect;
        OrderBy: Prisma.PaymentOrderByWithRelationInput;
        WhereUnique: Prisma.PaymentWhereUniqueInput;
        Where: Prisma.PaymentWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "subscription";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            subscription: {
                Shape: Subscription;
                Name: "Subscription";
                Nullable: false;
            };
        };
    };
    Rating: {
        Name: "Rating";
        Shape: Rating;
        Include: Prisma.RatingInclude;
        Select: Prisma.RatingSelect;
        OrderBy: Prisma.RatingOrderByWithRelationInput;
        WhereUnique: Prisma.RatingWhereUniqueInput;
        Where: Prisma.RatingWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "item";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
            item: {
                Shape: Item;
                Name: "Item";
                Nullable: false;
            };
        };
    };
    Report: {
        Name: "Report";
        Shape: Report;
        Include: Prisma.ReportInclude;
        Select: Prisma.ReportSelect;
        OrderBy: Prisma.ReportOrderByWithRelationInput;
        WhereUnique: Prisma.ReportWhereUniqueInput;
        Where: Prisma.ReportWhereInput;
        Create: {};
        Update: {};
        RelationName: "sender" | "reported" | "group" | "challenge";
        ListRelations: never;
        Relations: {
            sender: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            reported: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
            group: {
                Shape: Group | null;
                Name: "Group";
                Nullable: true;
            };
            challenge: {
                Shape: GroupChallenge | null;
                Name: "GroupChallenge";
                Nullable: true;
            };
        };
    };
    Subscription: {
        Name: "Subscription";
        Shape: Subscription;
        Include: Prisma.SubscriptionInclude;
        Select: Prisma.SubscriptionSelect;
        OrderBy: Prisma.SubscriptionOrderByWithRelationInput;
        WhereUnique: Prisma.SubscriptionWhereUniqueInput;
        Where: Prisma.SubscriptionWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "membership" | "payments";
        ListRelations: "payments";
        Relations: {
            user: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            membership: {
                Shape: Membership;
                Name: "Membership";
                Nullable: false;
            };
            payments: {
                Shape: Payment[];
                Name: "Payment";
                Nullable: false;
            };
        };
    };
    Tag: {
        Name: "Tag";
        Shape: Tag;
        Include: Prisma.TagInclude;
        Select: Prisma.TagSelect;
        OrderBy: Prisma.TagOrderByWithRelationInput;
        WhereUnique: Prisma.TagWhereUniqueInput;
        Where: Prisma.TagWhereInput;
        Create: {};
        Update: {};
        RelationName: "user" | "useItems" | "connectedChallenges";
        ListRelations: "useItems" | "connectedChallenges";
        Relations: {
            user: {
                Shape: User | null;
                Name: "User";
                Nullable: true;
            };
            useItems: {
                Shape: User_Item[];
                Name: "User_Item";
                Nullable: false;
            };
            connectedChallenges: {
                Shape: GroupChallenge[];
                Name: "GroupChallenge";
                Nullable: false;
            };
        };
    };
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "subscriptions" | "payments" | "friendshipSender" | "friendshipReceiver" | "notificationSender" | "notificationReceiver" | "reportSender" | "reportReported" | "groups" | "groupMemberships" | "groupListsCreated" | "lists" | "tags" | "userItems" | "ratings";
        ListRelations: "subscriptions" | "payments" | "friendshipSender" | "friendshipReceiver" | "notificationSender" | "notificationReceiver" | "reportSender" | "reportReported" | "groups" | "groupMemberships" | "groupListsCreated" | "lists" | "tags" | "userItems" | "ratings";
        Relations: {
            subscriptions: {
                Shape: Subscription[];
                Name: "Subscription";
                Nullable: false;
            };
            payments: {
                Shape: Payment[];
                Name: "Payment";
                Nullable: false;
            };
            friendshipSender: {
                Shape: Friendship[];
                Name: "Friendship";
                Nullable: false;
            };
            friendshipReceiver: {
                Shape: Friendship[];
                Name: "Friendship";
                Nullable: false;
            };
            notificationSender: {
                Shape: Notification[];
                Name: "Notification";
                Nullable: false;
            };
            notificationReceiver: {
                Shape: Notification[];
                Name: "Notification";
                Nullable: false;
            };
            reportSender: {
                Shape: Report[];
                Name: "Report";
                Nullable: false;
            };
            reportReported: {
                Shape: Report[];
                Name: "Report";
                Nullable: false;
            };
            groups: {
                Shape: Group[];
                Name: "Group";
                Nullable: false;
            };
            groupMemberships: {
                Shape: Group_User[];
                Name: "Group_User";
                Nullable: false;
            };
            groupListsCreated: {
                Shape: GroupList[];
                Name: "GroupList";
                Nullable: false;
            };
            lists: {
                Shape: List[];
                Name: "List";
                Nullable: false;
            };
            tags: {
                Shape: Tag[];
                Name: "Tag";
                Nullable: false;
            };
            userItems: {
                Shape: User_Item[];
                Name: "User_Item";
                Nullable: false;
            };
            ratings: {
                Shape: Rating[];
                Name: "Rating";
                Nullable: false;
            };
        };
    };
    Friendship: {
        Name: "Friendship";
        Shape: Friendship;
        Include: Prisma.FriendshipInclude;
        Select: Prisma.FriendshipSelect;
        OrderBy: Prisma.FriendshipOrderByWithRelationInput;
        WhereUnique: Prisma.FriendshipWhereUniqueInput;
        Where: Prisma.FriendshipWhereInput;
        Create: {};
        Update: {};
        RelationName: "sender" | "receiver";
        ListRelations: never;
        Relations: {
            sender: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
            receiver: {
                Shape: User;
                Name: "User";
                Nullable: false;
            };
        };
    };
}
export function getDatamodel(): PothosPrismaDatamodel { return JSON.parse("{\"datamodel\":{\"models\":{\"Group\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"ownerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"owner\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToUser\",\"relationFromFields\":[\"ownerId\"],\"isUpdatedAt\":false},{\"type\":\"ROLES_GROUP\",\"kind\":\"enum\",\"name\":\"randomizingRoles\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Group_User\",\"kind\":\"object\",\"name\":\"members\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToGroup_User\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupList\",\"kind\":\"object\",\"name\":\"groupLists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToGroupList\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupChallenge\",\"kind\":\"object\",\"name\":\"groupChallenges\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToGroupChallenge\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Notification\",\"kind\":\"object\",\"name\":\"notification\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToNotification\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Report\",\"kind\":\"object\",\"name\":\"report\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToReport\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"deletedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Group_User\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"groupId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"autoUpdateItems\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ROLES_GROUP\",\"kind\":\"enum\",\"name\":\"role\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Group\",\"kind\":\"object\",\"name\":\"group\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToGroup_User\",\"relationFromFields\":[\"groupId\"],\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Group_UserToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"GroupUser_Challenge\",\"kind\":\"object\",\"name\":\"groupUserProgression\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupUser_ChallengeToGroup_User\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupList_AcceptedItemHistory\",\"kind\":\"object\",\"name\":\"groupListAcceptedItemHistory\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupList_AcceptedItemHistoryToGroup_User\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"groupId\",\"userId\"]}]},\"GroupList\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"creatorId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"creator\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToUser\",\"relationFromFields\":[\"creatorId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"icon\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"color\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"groupId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Group\",\"kind\":\"object\",\"name\":\"group\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToGroupList\",\"relationFromFields\":[\"groupId\"],\"isUpdatedAt\":false},{\"type\":\"List\",\"kind\":\"object\",\"name\":\"memberLists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToList\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Item\",\"kind\":\"object\",\"name\":\"items\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"ListCategory\",\"kind\":\"object\",\"name\":\"listCategories\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToListCategory\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupChallenge\",\"kind\":\"object\",\"name\":\"connectedChallenges\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToGroupList\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupList_AcceptedItemHistory\",\"kind\":\"object\",\"name\":\"acceptedItemsHistory\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToGroupList_AcceptedItemHistory\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"GroupList_AcceptedItemHistory\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"groupListId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"GroupList\",\"kind\":\"object\",\"name\":\"groupList\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToGroupList_AcceptedItemHistory\",\"relationFromFields\":[\"groupListId\"],\"isUpdatedAt\":false},{\"type\":\"Group_User\",\"kind\":\"object\",\"name\":\"randomizingFor\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupList_AcceptedItemHistoryToGroup_User\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"itemId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Item\",\"kind\":\"object\",\"name\":\"item\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupList_AcceptedItemHistoryToItem\",\"relationFromFields\":[\"itemId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"randomizedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"GroupChallenge\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"groupId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Group\",\"kind\":\"object\",\"name\":\"group\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToGroupChallenge\",\"relationFromFields\":[\"groupId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"icon\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"color\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"STATUS_CHALLENGE\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"numericGoal\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"CHALLENGE_TIMEFRAME\",\"kind\":\"enum\",\"name\":\"timeframe\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Item\",\"kind\":\"object\",\"name\":\"item\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"CATEGORY\",\"kind\":\"enum\",\"name\":\"category\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"GroupList\",\"kind\":\"object\",\"name\":\"allowedLists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToGroupList\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Tag\",\"kind\":\"object\",\"name\":\"allowedTags\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToTag\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupUser_Challenge\",\"kind\":\"object\",\"name\":\"groupUserProgression\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToGroupUser_Challenge\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Notification\",\"kind\":\"object\",\"name\":\"notification\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToNotification\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Report\",\"kind\":\"object\",\"name\":\"report\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToReport\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"manualAdvancement\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"allowCompleted\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"startDate\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"endDate\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"GroupUser_Challenge\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"groupUserId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"challengeId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"numericGoalProgression\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User_Item\",\"kind\":\"object\",\"name\":\"itemsForChallenge\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupUser_ChallengeToUser_Item\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"challengeCompletedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Group_User\",\"kind\":\"object\",\"name\":\"group\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupUser_ChallengeToGroup_User\",\"relationFromFields\":[\"groupUserId\"],\"isUpdatedAt\":false},{\"type\":\"GroupChallenge\",\"kind\":\"object\",\"name\":\"challenge\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToGroupUser_Challenge\",\"relationFromFields\":[\"challengeId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"groupUserId\",\"challengeId\"]}]},\"Item\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"imageUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"CATEGORY\",\"kind\":\"enum\",\"name\":\"category\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User_Item\",\"kind\":\"object\",\"name\":\"userItems\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToUser_Item\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Rating\",\"kind\":\"object\",\"name\":\"ratings\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToRating\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupList\",\"kind\":\"object\",\"name\":\"groupLists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupChallenge\",\"kind\":\"object\",\"name\":\"challenges\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupList_AcceptedItemHistory\",\"kind\":\"object\",\"name\":\"acceptedItemsHistory\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupList_AcceptedItemHistoryToItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"name\",\"category\"]}]},\"User_Item\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"itemId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"note\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"STATUS_COMPLETION\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"completedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Tag\",\"kind\":\"object\",\"name\":\"tags\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TagToUser_Item\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"List_UserItem\",\"kind\":\"object\",\"name\":\"lists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"List_UserItemToUser_Item\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupUser_Challenge\",\"kind\":\"object\",\"name\":\"usedInChallenge\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupUser_ChallengeToUser_Item\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isHidden\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"UserToUser_Item\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"Item\",\"kind\":\"object\",\"name\":\"item\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToUser_Item\",\"relationFromFields\":[\"itemId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"itemId\"]}]},\"List\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"icon\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"color\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isHidden\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"isGiftedAtRegistration\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ListToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"ListCategory\",\"kind\":\"object\",\"name\":\"categories\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ListToListCategory\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"List_UserItem\",\"kind\":\"object\",\"name\":\"items\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ListToList_UserItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupList\",\"kind\":\"object\",\"name\":\"groupLists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToList\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"List_UserItem\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"listId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userItemId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"count\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"skippedCount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"acceptedCount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"List\",\"kind\":\"object\",\"name\":\"list\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ListToList_UserItem\",\"relationFromFields\":[\"listId\"],\"isUpdatedAt\":false},{\"type\":\"User_Item\",\"kind\":\"object\",\"name\":\"userItem\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"List_UserItemToUser_Item\",\"relationFromFields\":[\"userItemId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"listId\",\"userItemId\"]}]},\"ListCategory\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"icon\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"CATEGORY\",\"kind\":\"enum\",\"name\":\"includedCategories\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"List\",\"kind\":\"object\",\"name\":\"lists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ListToListCategory\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupList\",\"kind\":\"object\",\"name\":\"groupLists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToListCategory\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Membership\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"MEMBERSHIP_PLAN\",\"kind\":\"enum\",\"name\":\"plan\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"price\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"currency\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"BILLING\",\"kind\":\"enum\",\"name\":\"billing\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"limitations\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Subscription\",\"kind\":\"object\",\"name\":\"subscriptions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"MembershipToSubscription\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"deletedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Notification\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"title\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"body\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"NOTIFICATION_TYPE\",\"kind\":\"enum\",\"name\":\"notificationType\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"markedAsRead\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"senderId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"receiverId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"groupId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"challengeId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"sender\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Sender\",\"relationFromFields\":[\"senderId\"],\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"receiver\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Receiver\",\"relationFromFields\":[\"receiverId\"],\"isUpdatedAt\":false},{\"type\":\"Group\",\"kind\":\"object\",\"name\":\"group\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToNotification\",\"relationFromFields\":[\"groupId\"],\"isUpdatedAt\":false},{\"type\":\"GroupChallenge\",\"kind\":\"object\",\"name\":\"challenge\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToNotification\",\"relationFromFields\":[\"challengeId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"senderId\",\"receiverId\",\"groupId\"]}]},\"Payment\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PaymentToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"subscriptionId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Subscription\",\"kind\":\"object\",\"name\":\"subscription\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PaymentToSubscription\",\"relationFromFields\":[\"subscriptionId\"],\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"amount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"STATUS_PAYMENT\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"stripeInvoiceId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Rating\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"value\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"note\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"itemId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RatingToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"Item\",\"kind\":\"object\",\"name\":\"item\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToRating\",\"relationFromFields\":[\"itemId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"userId\",\"itemId\"]}]},\"Report\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"title\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"body\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"attachedFiles\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"REPORT_TYPE\",\"kind\":\"enum\",\"name\":\"reportType\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"STATUS_REPORT\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"senderId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"reportedId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"itemId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"groupId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"challengeId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"sender\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Sender\",\"relationFromFields\":[\"senderId\"],\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"reported\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Reported\",\"relationFromFields\":[\"reportedId\"],\"isUpdatedAt\":false},{\"type\":\"Group\",\"kind\":\"object\",\"name\":\"group\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToReport\",\"relationFromFields\":[\"groupId\"],\"isUpdatedAt\":false},{\"type\":\"GroupChallenge\",\"kind\":\"object\",\"name\":\"challenge\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToReport\",\"relationFromFields\":[\"challengeId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"senderId\",\"reportedId\"]},{\"name\":null,\"fields\":[\"senderId\",\"itemId\"]},{\"name\":null,\"fields\":[\"senderId\",\"groupId\"]},{\"name\":null,\"fields\":[\"senderId\",\"challengeId\"]}]},\"Subscription\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"SubscriptionToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"membershipId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Membership\",\"kind\":\"object\",\"name\":\"membership\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"MembershipToSubscription\",\"relationFromFields\":[\"membershipId\"],\"isUpdatedAt\":false},{\"type\":\"STATUS_SUBSCRIPTION\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"stripeSubId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"startDate\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"endDate\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Payment\",\"kind\":\"object\",\"name\":\"payments\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PaymentToSubscription\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Tag\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"color\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"userId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"user\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TagToUser\",\"relationFromFields\":[\"userId\"],\"isUpdatedAt\":false},{\"type\":\"User_Item\",\"kind\":\"object\",\"name\":\"useItems\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TagToUser_Item\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupChallenge\",\"kind\":\"object\",\"name\":\"connectedChallenges\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupChallengeToTag\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"User\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"username\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"email\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"passwordHash\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"resetPasswordToken\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"resetPasswordTokenExpiry\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"avatarUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"language\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ROLES\",\"kind\":\"enum\",\"name\":\"role\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Subscription\",\"kind\":\"object\",\"name\":\"subscriptions\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"SubscriptionToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Payment\",\"kind\":\"object\",\"name\":\"payments\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"PaymentToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Friendship\",\"kind\":\"object\",\"name\":\"friendshipSender\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Sender\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Friendship\",\"kind\":\"object\",\"name\":\"friendshipReceiver\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Receiver\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Notification\",\"kind\":\"object\",\"name\":\"notificationSender\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Sender\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Notification\",\"kind\":\"object\",\"name\":\"notificationReceiver\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Receiver\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Report\",\"kind\":\"object\",\"name\":\"reportSender\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Sender\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Report\",\"kind\":\"object\",\"name\":\"reportReported\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Reported\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Group\",\"kind\":\"object\",\"name\":\"groups\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Group_User\",\"kind\":\"object\",\"name\":\"groupMemberships\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Group_UserToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"GroupList\",\"kind\":\"object\",\"name\":\"groupListsCreated\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"GroupListToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"List\",\"kind\":\"object\",\"name\":\"lists\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ListToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Tag\",\"kind\":\"object\",\"name\":\"tags\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"TagToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"User_Item\",\"kind\":\"object\",\"name\":\"userItems\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"UserToUser_Item\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Rating\",\"kind\":\"object\",\"name\":\"ratings\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"RatingToUser\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"deletedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"username\",\"email\"]}]},\"Friendship\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"senderId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"receiverId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"STATUS_FRIENDSHIP\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"sender\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Sender\",\"relationFromFields\":[\"senderId\"],\"isUpdatedAt\":false},{\"type\":\"User\",\"kind\":\"object\",\"name\":\"receiver\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"Receiver\",\"relationFromFields\":[\"receiverId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"senderId\",\"receiverId\"]}]}}}}"); }