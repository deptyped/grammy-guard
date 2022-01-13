import { Bot } from "grammy";
import { guard, isAdmin, reply, not, isPrivate } from "grammy-guard";

// Create a bot.
const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command(
  "private",
  guard(isPrivate, reply("/private is only available in private chats!")),
  (ctx) => ctx.reply("Hello in private!")
);

bot.command(
  "admin",
  guard(
    [not(isPrivate), isAdmin],
    reply("/admin is only available to administrators in non-private chats!")
  ),
  (ctx) => ctx.reply("Hello, chat admin!")
);

bot.command("start", (ctx) => ctx.reply("Hello!"));

bot.start();
