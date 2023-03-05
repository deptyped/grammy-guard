import type {
  CallbackData,
  FilterClause,
  Schema,
} from "https://lib.deno.dev/x/callback_data@1.x/types.ts";
import { createCallbackData } from "https://lib.deno.dev/x/callback_data@1.x/mod.ts";
import { CallbackQueryContext, Context } from "./deps.ts";

type Identifier = Parameters<typeof createCallbackData>[0];
type Registry = Map<Identifier, ReturnType<typeof createCallbackData>>;

class CallbackDataRegistry<T> {
  protected registry: Registry;

  constructor() {
    this.registry = new Map();
  }

  add<I extends Identifier, S extends Schema>(
    id: I,
    schema: S,
  ): CallbackDataRegistry<
    T & Record<I, S>
  > {
    if (this.registry.has(id)) {
      throw new Error(
        `Callback data with ID "${id}" already exists`,
      );
    }

    this.registry.set(id, createCallbackData(id, schema));

    return this as CallbackDataRegistry<
      T & Record<I, S>
    >;
  }

  create<I extends keyof T>(id: I, data: CallbackData<T[I]>) {
    if (!this.registry.has(id.toString())) {
      throw new Error(
        `Callback data with ID "${id.toString()}" does not exist`,
      );
    }

    return this.registry.get(id.toString())!.pack(data);
  }

  parse<I extends keyof T>(id: I, packedData: string): CallbackData<T[I]> {
    if (!this.registry.has(id.toString())) {
      throw new Error(
        `Callback data with ID "${id.toString()}" does not exist`,
      );
    }

    return this.registry.get(id.toString())!.unpack(packedData) as CallbackData<
      T[I]
    >;
  }

  regex<I extends keyof T>(id: I, clause?: FilterClause<T[I]>) {
    if (!this.registry.has(id.toString())) {
      throw new Error(
        `Callback data with ID "${id.toString()}" does not exist`,
      );
    }

    return this.registry.get(id.toString())!.filter(clause);
  }

  filter<I extends keyof T>(
    id: I,
    clause?: FilterClause<T[I]>,
  ): <C extends Context>(
    ctx: C,
  ) => ctx is CallbackQueryContext<
    C & {
      callbackData: CallbackData<T[I]>;
    }
  > {
    if (!this.registry.has(id.toString())) {
      throw new Error(
        `Callback data with ID "${id.toString()}" does not exist`,
      );
    }

    return <C extends Context>(
      ctx: C,
    ): ctx is CallbackQueryContext<
      C & {
        callbackData: CallbackData<T[I]>;
      }
    > => {
      if (ctx.hasCallbackQuery(this.regex(id, clause))) {
        // @ts-expect-error declare property dynamic
        ctx.callbackData = this.registry.get(id.toString())!
          .unpack(ctx.callbackQuery.data) as CallbackData<T[I]>;

        return true;
      }

      return false;
    };
  }
}

export function createCallbackDataRegistry() {
  return new CallbackDataRegistry();
}
