import { Context } from "./deps.ts";
import { MaybePromise, Predicate } from "./types.ts";

export function not<C extends Context>(predicate: Predicate<C>) {
  return (ctx: C) => Promise.resolve(predicate(ctx)).then((v) => !v);
}

export function and<C extends Context>(...predicate: Array<Predicate<C>>) {
  return (ctx: C) =>
    Promise.resolve(predicate.map((predicate) => predicate(ctx))).then((v) =>
      v.every(Boolean)
    );
}

export function or<C extends Context>(...predicate: Array<Predicate<C>>) {
  return (ctx: C) =>
    Promise.resolve(predicate.map((predicate) => predicate(ctx))).then((v) =>
      v.some(Boolean)
    );
}

export function reply<C extends Context>(
  errorMessage: string | ((ctx: C) => MaybePromise<string>),
  options?: {
    replyToMessage: boolean;
  },
) {
  const {
    replyToMessage,
  } = options ?? {
    replyToMessage: false,
  };

  return async (ctx: C) => {
    const text = typeof errorMessage === "function"
      ? await errorMessage(ctx)
      : errorMessage;

    if (ctx.callbackQuery) {
      return await ctx.answerCallbackQuery({
        text,
      });
    }

    return await ctx.reply(text, {
      ...(replyToMessage && {
        reply_to_message_id: ctx.msg?.message_id,
      }),
    });
  };
}
