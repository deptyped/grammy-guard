import {
  AliasProps,
  Chat,
  ChatMember,
  ChatTypeContext,
  Context,
  DeepRequired,
  Object,
} from "./deps.deno.ts";

export type MaybePromise<T> = T | Promise<T>;

export type Predicate<C extends Context> = (ctx: C) => MaybePromise<boolean>;

export type Ensure<C extends Context, P extends string[]> = DeepRequired<
  Object.P.Pick<C, P>
>;

export type EnsureContext<C extends Context, P extends string[]> =
  & C
  & Ensure<C, P>;

export type UserContext<C extends Context> = EnsureContext<C, ["from"]>;

export type SenderChatContext<C extends Context> = EnsureContext<
  C,
  ["senderChat"]
>;

export type PrivateChatContext<C extends Context> = ChatTypeContext<
  C,
  "private"
>;

export type BasicGroupChatContext<C extends Context> = ChatTypeContext<
  C,
  "group"
>;

export type SupergroupChatContext<C extends Context> = ChatTypeContext<
  C,
  "supergroup"
>;

export type GroupChatContext<C extends Context> = ChatTypeContext<
  C,
  "group" | "supergroup"
>;

export type ChannelChatContext<C extends Context> = ChatTypeContext<
  C,
  "channel"
>;

export type ChatContext<C extends Context> = ChatTypeContext<C, Chat["type"]>;

type MyChatMemberType<T extends ChatMember["status"]> = {
  my_chat_member: {
    new_chat_member: {
      status: T;
    };
  };
};

export type MyChatMemberTypeContext<
  C extends Context,
  T extends ChatMember["status"],
> = C & MyChatMemberType<T> & AliasProps<MyChatMemberType<T>>;

type ChatMemberType<T extends ChatMember["status"]> = {
  chat_member: {
    new_chat_member: {
      status: T;
    };
  };
};

export type ChatMemberTypeContext<
  C extends Context,
  T extends ChatMember["status"],
> = C & ChatMemberType<T> & AliasProps<ChatMemberType<T>>;

export type MessageWithReplyContext<C extends Context> =
  & C
  & Ensure<C, ["msg", "reply_to_message"]>
  & Ensure<C, ["message", "reply_to_message"]>;
