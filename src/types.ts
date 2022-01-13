import { Context } from "grammy";

export type MaybePromise<T> = T | Promise<T>;
export type Predicate<C extends Context> = (ctx: C) => MaybePromise<boolean>;
