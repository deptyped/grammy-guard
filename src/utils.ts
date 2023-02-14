import { Chat } from "./deps.ts";

export const normalizeUsername = (username: string) =>
  username.trim().toLowerCase();

export const isChatWithUsername = (
  chat: Chat,
): chat is Chat.PrivateChat | Chat.SupergroupChat | Chat.ChannelChat =>
  chat.type === "private" || chat.type === "supergroup" ||
  chat.type === "channel";
