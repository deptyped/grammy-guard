import { Context, MiddlewareFn } from "./deps.ts";
import { Predicate } from "./types.ts";

export function guard<C extends Context>(
  predicate: Predicate<C> | Array<Predicate<C>>,
  errorHandler?: MiddlewareFn<C>,
): MiddlewareFn<C> {
  return async (ctx, next) => {
    const predicates = Array.isArray(predicate)
      ? predicate.map((predicate) => predicate(ctx))
      : [predicate(ctx)];

    const isPassed = (await Promise.all(predicates)).every(Boolean);

    if (isPassed) {
      return next();
    }

    if (typeof errorHandler === "function") {
      return errorHandler(ctx, next);
    }
  };
}
