import { Chat, ChatMember, ChatTypeContext, Context } from "./deps.ts";
import type {
  ChatMemberContext,
  MyChatMemberContext,
  SenderChatContext,
  UserContext,
} from "./types.ts";
import { isChatWithUsername, normalizeUsername } from "./utils.ts";

/// Chat filters

export function isPrivateChat<C extends Context>(
  ctx: C,
): ctx is ChatTypeContext<
  C,
  "private"
> {
  return ctx.hasChatType("private");
}

export function isBasicGroup<C extends Context>(ctx: C): ctx is ChatTypeContext<
  C,
  "group"
> {
  return ctx.hasChatType("group");
}

export function isSupergroup<C extends Context>(ctx: C): ctx is ChatTypeContext<
  C,
  "supergroup"
> {
  return ctx.hasChatType("supergroup");
}

export function isGroupChat<C extends Context>(ctx: C): ctx is ChatTypeContext<
  C,
  "group" | "supergroup"
> {
  return isBasicGroup(ctx) || isSupergroup(ctx);
}

export function isChannel<C extends Context>(ctx: C): ctx is ChatTypeContext<
  C,
  "channel"
> {
  return ctx.hasChatType("channel");
}

export function isChat<C extends Context>(
  ctx: C,
): ctx is ChatTypeContext<C, Chat["type"]> {
  return typeof ctx.chat !== "undefined";
}

export function isChatHasId(...id: number[]) {
  return <C extends Context>(ctx: C): ctx is ChatTypeContext<C, Chat["type"]> =>
    isChat(ctx) && id.includes(ctx.chat.id);
}

export function isChatHasUsername(...username: string[]) {
  username = username.map(normalizeUsername);

  return <C extends Context>(
    ctx: C,
  ): ctx is ChatTypeContext<C, Chat["type"]> =>
    isChat(ctx) &&
    isChatWithUsername(ctx.chat) &&
    typeof ctx.chat.username === "string" &&
    username.includes(normalizeUsername(ctx.chat.username));
}

/// Peer filters

// User

export function isUser<C extends Context>(ctx: C): ctx is UserContext<C> {
  return ctx.from?.is_bot === false;
}

export function isUserHasId(...id: number[]) {
  return <C extends Context>(ctx: C): ctx is UserContext<C> =>
    isUser(ctx) && id.includes(ctx.from.id);
}

export function isUserHasUsername(...username: string[]) {
  username = username.map(normalizeUsername);

  return <C extends Context>(ctx: C): ctx is UserContext<C> =>
    isUser(ctx) && typeof ctx.from.username === "string" &&
    username.includes(normalizeUsername(ctx.from.username));
}

// Bot

export function isBot<C extends Context>(ctx: C): ctx is UserContext<C> {
  return ctx.from?.is_bot === true;
}

export function isBotHasId(...id: number[]) {
  return <C extends Context>(ctx: C): ctx is UserContext<C> =>
    isBot(ctx) && id.includes(ctx.from.id);
}

export function isBotHasUsername(...username: string[]) {
  username = username.map(normalizeUsername);

  return <C extends Context>(ctx: C): ctx is UserContext<C> =>
    isBot(ctx) && typeof ctx.from.username === "string" &&
    username.includes(normalizeUsername(ctx.from.username));
}

// Sender chat

export function isSenderChat<C extends Context>(
  ctx: C,
): ctx is SenderChatContext<C> {
  return typeof ctx.senderChat !== "undefined";
}

export function isSenderChatHasId(...id: number[]) {
  return <C extends Context>(ctx: C): ctx is SenderChatContext<C> =>
    isSenderChat(ctx) && id.includes(ctx.senderChat.id);
}

export function isSenderChatHasUsername(...username: string[]) {
  username = username.map(normalizeUsername);

  return <C extends Context>(ctx: C): ctx is SenderChatContext<C> =>
    isSenderChat(ctx) && isChatWithUsername(ctx.senderChat) &&
    typeof ctx.senderChat.username === "string" &&
    username.includes(normalizeUsername(ctx.senderChat.username));
}

/// Chat member status

export function isChatMemberStatus<T extends ChatMember["status"]>(status: T) {
  return <C extends Context>(
    ctx: C,
  ): ctx is ChatMemberContext<C, T> =>
    ctx.chatMember?.new_chat_member.status === status;
}

export function isMyChatMemberStatus<T extends ChatMember["status"]>(
  status: T,
) {
  return <C extends Context>(
    ctx: C,
  ): ctx is MyChatMemberContext<C, T> =>
    ctx.myChatMember?.new_chat_member.status === status;
}

/// Miscellaneous

export function isUserFromReply<C extends Context>(
  ctx: C,
): ctx is UserContext<C> {
  return ctx.msg?.from?.id === ctx.msg?.reply_to_message?.from?.id;
}

export async function isAdmin<C extends Context>(ctx: C) {
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
}

// Deprecated. For backward compatibility
// TODO: Remove in 1.0

/**
 * @deprecated The filter should not be used. Use `isPrivateChat` instead.
 */
export const isPrivate = isPrivateChat;

/**
 * @deprecated The filter should not be used. Use `isGroupChat` instead.
 */
export const isGroup = isGroupChat;

/**
 * @deprecated The filter should not be used. Use `isUserHasId` instead.
 */
export const isUserId = isUserHasId;

/**
 * @deprecated The filter should not be used. Use `isChatHasId` instead.
 */
export const isChatId = isChatHasId;

/**
 * @deprecated The filter should not be used. Use `isSenderChatHasId` instead.
 */
export const isSenderChatId = isSenderChatHasId;
