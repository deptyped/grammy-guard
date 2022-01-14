import { Context } from "./deps.deno.ts";

export type MaybePromise<T> = T | Promise<T>;
export type Predicate<C extends Context> = (ctx: C) => MaybePromise<boolean>;
