import { Bot } from "https://deno.land/x/grammy@v1.10.0/mod.ts";
import {
  guard,
  isAdmin,
  isPrivate,
  not,
  reply,
} from "https://deno.land/x/grammy_guard@v0.3.1/mod.ts";

// Create a bot.
const bot = new Bot(Deno.env.get("BOT_TOKEN") as string);

bot.command(
  "private",
  guard(isPrivate, reply("/private is only available in private chats!")),
  (ctx) => ctx.reply("Hello in private!"),
);

bot.command(
  "admin",
  guard(
    [not(isPrivate), isAdmin],
    reply("/admin is only available to administrators in non-private chats!"),
  ),
  (ctx) => ctx.reply("Hello, chat admin!"),
);

bot.command("start", (ctx) => ctx.reply("Hello!"));

bot.start();
