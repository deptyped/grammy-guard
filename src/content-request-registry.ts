import { Context } from "./deps.ts";
import { ChatSharedContext, UserSharedContext } from "./types.ts";

type Registry = Map<string | number | symbol, number>;
type Reason = Parameters<Registry["get"]>[0];
type RequestId = Parameters<Registry["set"]>[1];

const getOrThrow = (registry: Registry, reason: Reason) => {
  if (!registry.has(reason)) {
    throw new Error(
      `Request with reason "${reason.toString()}" does not exist`,
    );
  }

  return registry.get(reason);
};

const addOrThrow = (
  registry: Registry,
  reason: Reason,
  requestId: RequestId,
) => {
  if (registry.has(reason)) {
    throw new Error(
      `Request with reason "${reason.toString()}" already exists`,
    );
  }

  for (
    const [
      existingReason,
      existingRequestId,
    ] of registry.entries()
  ) {
    if (existingRequestId === requestId) {
      throw new Error(
        `Request with ID "${requestId}" already exists (${
          String(existingReason)
        })`,
      );
    }
  }

  registry.set(reason, requestId);
};

class UserRequestRegistry<T> {
  protected registry: Registry;

  constructor() {
    this.registry = new Map();
  }

  getId<R extends keyof T>(reason: R): T[R] {
    return getOrThrow(this.registry, reason) as T[R];
  }

  add<R extends Reason>(
    reason: R,
    requestId: RequestId,
  ): UserRequestRegistry<T & Record<R, RequestId>> {
    addOrThrow(this.registry, reason, requestId);

    return this as UserRequestRegistry<T & Record<R, RequestId>>;
  }

  filter<R extends keyof T>(reason: R) {
    if (!this.registry.has(reason)) {
      throw new Error(
        `Request with reason "${String(reason)}" does not exist`,
      );
    }

    return <C extends Context>(
      ctx: C,
    ): ctx is UserSharedContext<C> =>
      ctx.msg?.user_shared?.request_id ===
        this.registry.get(reason);
  }
}

class ChatRequestRegistry<T> {
  protected registry: Registry;

  constructor() {
    this.registry = new Map();
  }

  getId<R extends keyof T>(reason: R): T[R] {
    return getOrThrow(this.registry, reason) as T[R];
  }

  add<R extends Reason>(
    reason: R,
    requestId: RequestId,
  ): ChatRequestRegistry<T & Record<R, RequestId>> {
    addOrThrow(this.registry, reason, requestId);

    return this as ChatRequestRegistry<T & Record<R, RequestId>>;
  }

  filter<R extends keyof T>(reason: R) {
    if (!this.registry.has(reason)) {
      throw new Error(
        `Request with reason "${String(reason)}" does not exist`,
      );
    }

    return <C extends Context>(
      ctx: C,
    ): ctx is ChatSharedContext<C> =>
      ctx.msg?.chat_shared?.request_id ===
        this.registry.get(reason);
  }
}

export function createUserRequestRegistry() {
  return new UserRequestRegistry();
}

export function createChatRequestRegistry() {
  return new ChatRequestRegistry();
}
