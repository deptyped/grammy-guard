import { Bot } from "https://deno.land/x/grammy@v1.6.1/mod.ts";
import {
    guard,
    isPrivate,
    reply,
} from "https://deno.land/x/grammy_guard@v0.2.0/mod.ts";

// Create a bot.
const bot = new Bot(Deno.env.get("BOT_TOKEN") as string);

bot.command(
    "private",
    guard(
        isPrivate,
        reply(
            (ctx) =>
                `${ctx.from
                    ?.first_name}, /private is only available in private chats!`,
        ),
    ),
    (ctx) => ctx.reply("Hello in private!"),
);

bot.command("start", (ctx) => ctx.reply("Hello!"));

bot.start();
