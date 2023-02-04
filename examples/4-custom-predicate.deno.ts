import { Bot } from "https://deno.land/x/grammy@v1.14.1/mod.ts";
import { guard } from "https://deno.land/x/grammy_guard@v0.3.1/mod.ts";

// Create a bot.
const bot = new Bot(Deno.env.get("BOT_TOKEN") as string);

bot.command(
  "private",
  guard(
    // custom guard predicate
    (ctx) => {
      return ctx.chat?.type === "private";
    },
    // custom guard error handler
    (ctx) => {
      return ctx.reply("/private is only available in private chats!");
    },
  ),
  (ctx) => ctx.reply("Hello in private!"),
);

bot.command("start", (ctx) => ctx.reply("Hello!"));

bot.start();
