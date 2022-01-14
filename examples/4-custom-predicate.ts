import { Bot } from "grammy";
import { guard } from "grammy-guard";

// Create a bot.
const bot = new Bot(process.env.BOT_TOKEN as string);

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
