// deno-lint-ignore-file no-explicit-any

import { ChatMember, Context } from "./deps.deno.ts";
import type {
  BasicGroupChatContext,
  ChannelChatContext,
  ChatContext,
  ChatMemberTypeContext,
  GroupChatContext,
  MessageWithReplyContext,
  MyChatMemberTypeContext,
  PrivateChatContext,
  SenderChatContext,
  SupergroupChatContext,
  UserContext,
} from "./types.ts";

const normalizeUsername = (v: string) => v.trim().toLowerCase();

const get = (key: string, obj: any) =>
  key.split(".").reduce((a, b) => a && a[b], obj);

const getPeerId = (peer: any) => get("id", peer);

const getPeerUsername = (peer: any) => {
  const username = get("username", peer);

  if (typeof username === "string") {
    return normalizeUsername(username);
  }

  return username;
};

/// Chat filters

export const isPrivate = <C extends Context>(
  ctx: C,
): ctx is PrivateChatContext<C> => ctx.hasChatType("private");

export const isBasicGroup = <C extends Context>(
  ctx: C,
): ctx is BasicGroupChatContext<C> => ctx.hasChatType("group");

export const isSupergroup = <C extends Context>(
  ctx: C,
): ctx is SupergroupChatContext<C> => ctx.hasChatType("supergroup");

export const isGroup = <C extends Context>(
  ctx: C,
): ctx is GroupChatContext<C> => isBasicGroup(ctx) || isSupergroup(ctx);

export const isChannel = <C extends Context>(
  ctx: C,
): ctx is ChannelChatContext<C> => ctx.hasChatType("channel");

export const isChat = <C extends Context>(ctx: C): ctx is ChatContext<C> =>
  typeof ctx.chat !== "undefined";

export const isChatHasId =
  (...id: number[]) => <C extends Context>(ctx: C): ctx is ChatContext<C> =>
    id.includes(getPeerId(ctx.chat));

export const isChatHasUsername = (...username: string[]) => {
  username = username.map(normalizeUsername);
  return <C extends Context>(ctx: C): ctx is ChatContext<C> =>
    username.includes(getPeerUsername(ctx.chat));
};

/// Peer filters

// User

export const isUser = <C extends Context>(ctx: C): ctx is UserContext<C> =>
  ctx.from?.is_bot === false;

export const isUserHasId =
  (...id: number[]) => <C extends Context>(ctx: C): ctx is UserContext<C> =>
    isUser(ctx) && id.includes(getPeerId(ctx.from));

export const isUserHasUsername = (...username: string[]) => {
  username = username.map(normalizeUsername);
  return <C extends Context>(ctx: C): ctx is UserContext<C> =>
    isUser(ctx) && username.includes(getPeerUsername(ctx.from));
};

// Bot

export const isBot = <C extends Context>(ctx: C): ctx is UserContext<C> =>
  ctx.from?.is_bot === true;

export const isBotHasId =
  (...id: number[]) => <C extends Context>(ctx: C): ctx is UserContext<C> =>
    isBot(ctx) && id.includes(getPeerId(ctx.from));

export const isBotHasUsername = (...username: string[]) => {
  username = username.map(normalizeUsername);
  return <C extends Context>(ctx: C): ctx is UserContext<C> =>
    isBot(ctx) && username.includes(getPeerUsername(ctx.from));
};

// Sender chat

export const isSenderChat = <C extends Context>(
  ctx: C,
): ctx is SenderChatContext<C> => typeof ctx.senderChat !== "undefined";

export const isSenderChatHasId =
  (...id: number[]) =>
  <C extends Context>(ctx: C): ctx is SenderChatContext<C> =>
    id.includes(getPeerId(ctx.senderChat));

export const isSenderChatHasUsername = (...username: string[]) => {
  username = username.map(normalizeUsername);
  return <C extends Context>(ctx: C): ctx is SenderChatContext<C> =>
    username.includes(getPeerUsername(ctx.senderChat));
};

/// Chat member status

export const isChatMemberStatus =
  <T extends ChatMember["status"]>(status: T) =>
  <C extends Context>(
    ctx: C,
  ): ctx is UserContext<C> & ChatContext<C> & ChatMemberTypeContext<C, T> =>
    ctx.chatMember?.new_chat_member.status === status;

export const isMyChatMemberStatus =
  <T extends ChatMember["status"]>(status: T) =>
  <C extends Context>(
    ctx: C,
  ): ctx is UserContext<C> & ChatContext<C> & MyChatMemberTypeContext<C, T> =>
    ctx.myChatMember?.new_chat_member.status === status;

/// Miscellaneous

export const isUserFromReply = <C extends Context>(
  ctx: C,
): ctx is UserContext<C> & MessageWithReplyContext<C> =>
  ctx.msg?.from?.id === ctx.msg?.reply_to_message?.from?.id;

export const isAdmin = async <C extends Context>(ctx: C) => {
  if (ctx.from?.username === "GroupAnonymousBot") {
    return true;
  }

  if (ctx.chat && ["channel", "private"].includes(ctx.chat.type)) {
    return true;
  }

  if (ctx.from) {
    const member = await ctx.getChatMember(ctx.from?.id);
    if (["creator", "administrator"].includes(member.status)) {
      return true;
    }
  }

  return false;
};
