import { Context } from "./deps.deno.ts";

/// Chat filters

export const isPrivate = (ctx: Context) => ctx.chat?.type === "private";

export const isBasicGroup = (ctx: Context) => ctx.chat?.type === "group";

export const isSupergroup = (ctx: Context) => ctx.chat?.type === "supergroup";

export const isGroup = (ctx: Context) => isBasicGroup(ctx) || isSupergroup(ctx);

export const isChannel = (ctx: Context) => ctx.chat?.type === "channel";

export const isChat = (ctx: Context) => typeof ctx.chat !== "undefined";

export const isChatHasId = (id: number) => (ctx: Context) => ctx.chat?.id === id;

export const isChatHasUsername = (username: string) =>
    (ctx: Context) => ctx?.chat && "username" in ctx.chat ? ctx.chat.username === username : false;

/// Peer filters

// User

export const isUser = (ctx: Context) => ctx.from?.is_bot === false;

export const isUserHasId = (id: number) => (ctx: Context) => isUser(ctx) && ctx.from?.id === id;

export const isUserHasUsername = (username: string) =>
    (ctx: Context) => isUser(ctx) && ctx.from?.username === username;

// Bot

export const isBot = (ctx: Context) => ctx.from?.is_bot === true;

export const isBotHasId = (id: number) => (ctx: Context) => isBot(ctx) && ctx.from?.id === id;

export const isBotHasUsername = (username: string) =>
    (ctx: Context) => isBot(ctx) && ctx.from?.username === username;

// Sender chat

export const isSenderChat = (ctx: Context) => typeof ctx.senderChat !== "undefined";

export const isSenderChatHasId = (id: number) => (ctx: Context) => ctx.senderChat?.id === id;

export const isSenderChatHasUsername = (username: string) =>
    (ctx: Context) =>
        ctx?.senderChat && "username" in ctx.senderChat
            ? ctx.senderChat.username === username
            : false;

/// Miscellaneous

export const isUserFromReply = (ctx: Context) =>
    ctx.msg?.from?.id === ctx.msg?.reply_to_message?.from?.id;

export const isAdmin = async (ctx: Context) => {
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

// Deprecated. For backward compatibility
// TODO: Remove in 1.0

export const isUserId = isUserHasId;

export const isChatId = isChatHasId;

export const isSenderChatId = isSenderChatHasId;
