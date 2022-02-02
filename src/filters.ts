import { Context } from "./deps.deno.ts";

const normalizeUsername = (v: string) => v.trim().toLowerCase();

const get = (key: string, obj: any) => key.split(".").reduce((a, b) => a && a[b], obj);

const getPeerId = (peer: any) => get("id", peer);

const getPeerUsername = (peer: any) => {
    const username = get("username", peer);

    if (typeof username === "string") {
        return normalizeUsername(username);
    }

    return username;
};

/// Chat filters

export const isPrivate = (ctx: Context) => ctx.chat?.type === "private";

export const isBasicGroup = (ctx: Context) => ctx.chat?.type === "group";

export const isSupergroup = (ctx: Context) => ctx.chat?.type === "supergroup";

export const isGroup = (ctx: Context) => isBasicGroup(ctx) || isSupergroup(ctx);

export const isChannel = (ctx: Context) => ctx.chat?.type === "channel";

export const isChat = (ctx: Context) => typeof ctx.chat !== "undefined";

export const isChatHasId = (...id: number[]) => (ctx: Context) => id.includes(getPeerId(ctx.chat));

export const isChatHasUsername = (...username: string[]) => {
    username = username.map(normalizeUsername);
    return (ctx: Context) => username.includes(getPeerUsername(ctx.chat));
};

/// Peer filters

// User

export const isUser = (ctx: Context) => ctx.from?.is_bot === false;

export const isUserHasId = (...id: number[]) =>
    (ctx: Context) => isUser(ctx) && id.includes(getPeerId(ctx.from));

export const isUserHasUsername = (...username: string[]) => {
    username = username.map(normalizeUsername);
    return (ctx: Context) => isUser(ctx) && username.includes(getPeerUsername(ctx.from));
};

// Bot

export const isBot = (ctx: Context) => ctx.from?.is_bot === true;

export const isBotHasId = (...id: number[]) =>
    (ctx: Context) => isBot(ctx) && id.includes(getPeerId(ctx.from));

export const isBotHasUsername = (...username: string[]) => {
    username = username.map(normalizeUsername);
    return (ctx: Context) =>
        isBot(ctx) &&
        username.includes(getPeerUsername(ctx.from));
};

// Sender chat

export const isSenderChat = (ctx: Context) => typeof ctx.senderChat !== "undefined";

export const isSenderChatHasId = (...id: number[]) =>
    (ctx: Context) => id.includes(getPeerId(ctx.senderChat));

export const isSenderChatHasUsername = (...username: string[]) => {
    username = username.map(normalizeUsername);
    return (ctx: Context) => username.includes(getPeerUsername(ctx.senderChat));
};

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
