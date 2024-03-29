import {
  Chat,
  ChatMember,
  ChatMemberUpdated,
  Context,
  Filter,
  User,
} from "./deps.ts";

export type MaybePromise<T> = T | Promise<T>;

export type Predicate<C extends Context> = (ctx: C) => MaybePromise<boolean>;

// ctx.from

type UserType = {
  from: User;
};

export type UserContext<
  C extends Context = Context,
> = C & UserType;

// ctx.senderChat

type SenderChatType = {
  senderChat: Chat;
};

export type SenderChatContext<
  C extends Context = Context,
> = C & SenderChatType;

// ctx.myChatMember

type MyChatMemberType<T extends ChatMember["status"]> = {
  myChatMember: ChatMemberUpdated & {
    new_chat_member: {
      status: T;
    };
  };
};

export type MyChatMemberContext<
  C extends Context = Context,
  T extends ChatMember["status"] = ChatMember["status"],
> = C & MyChatMemberType<T>;

// ctx.chatMember

type ChatMemberType<T extends ChatMember["status"]> = {
  chatMember: ChatMemberUpdated & {
    new_chat_member: {
      status: T;
    };
  };
};

export type ChatMemberContext<
  C extends Context = Context,
  T extends ChatMember["status"] = ChatMember["status"],
> = C & ChatMemberType<T>;

// ctx.msg.user_shared

export type UserSharedContext<
  C extends Context = Context,
> = Filter<
  C,
  ":user_shared"
>;

// ctx.msg.user_shared

export type ChatSharedContext<
  C extends Context = Context,
> = Filter<
  C,
  ":chat_shared"
>;
