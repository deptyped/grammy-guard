import { Context } from "./deps.deno.ts";

export const isPrivate = (ctx: Context) => ctx.chat?.type === "private";

export const isBasicGroup = (ctx: Context) => ctx.chat?.type === "group";

export const isSupergroup = (ctx: Context) => ctx.chat?.type === "supergroup";

export const isGroup = (ctx: Context) => isBasicGroup(ctx) || isSupergroup(ctx);

export const isChannel = (ctx: Context) => ctx.chat?.type === "channel";

export const isUser = (ctx: Context) => ctx.from?.is_bot === false;

export const isBot = (ctx: Context) => ctx.from?.is_bot === true;

export const isUserId = (id: number) => (ctx: Context) => ctx.from?.id === id;

export const isChatId = (id: number) => (ctx: Context) => ctx.chat?.id === id;

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
