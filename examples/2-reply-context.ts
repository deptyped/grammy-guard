import { Bot } from "grammy";
import { guard, reply, isPrivate } from "grammy-guard";

// Create a bot.
const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command(
  "private",
  guard(
    isPrivate,
    reply(
      (ctx) =>
        `${ctx.from?.first_name}, /private is only available in private chats!`
    )
  ),
  (ctx) => ctx.reply("Hello in private!")
);

bot.command("start", (ctx) => ctx.reply("Hello!"));

bot.start();
