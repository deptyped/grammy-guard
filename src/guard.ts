import { Context, NextFunction, MiddlewareFn } from "grammy";
import { Predicate } from "./types";

export const guard =
  <C extends Context>(
    predicate: Predicate<C> | Array<Predicate<C>>,
    errorHandler?: MiddlewareFn<C>
  ) =>
  async (ctx: C, next: NextFunction) => {
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
