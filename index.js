require("dotenv").config();
const { Telegraf } = require("telegraf");

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("Missing TELEGRAM_BOT_TOKEN in environment.");
}

const parseIdList = (value) =>
  (value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const sourceChatIds = new Set(parseIdList(process.env.SOURCE_CHAT_IDS));
const destinationChatIds = parseIdList(process.env.DESTINATION_CHAT_IDS);

if (sourceChatIds.size === 0) {
  throw new Error("SOURCE_CHAT_IDS must contain at least one channel/chat id.");
}

if (destinationChatIds.length === 0) {
  throw new Error("DESTINATION_CHAT_IDS must contain at least one channel/chat id.");
}

const bot = new Telegraf(token);

bot.on("channel_post", async (ctx) => {
  const msg = ctx.channelPost;
  if (!msg) {
    return;
  }

  const sourceId = String(msg.chat.id);
  if (!sourceChatIds.has(sourceId)) {
    return;
  }

  await Promise.all(
    destinationChatIds.map(async (destinationId) => {
      if (destinationId === sourceId) {
        return;
      }

      try {
        await ctx.telegram.forwardMessage(destinationId, msg.chat.id, msg.message_id);
        console.log(`Forwarded message ${msg.message_id} ${sourceId} -> ${destinationId}`);
      } catch (error) {
        console.error(
          `Failed forwarding message ${msg.message_id} ${sourceId} -> ${destinationId}:`,
          error.message
        );
      }
    })
  );
});

bot.catch((error) => {
  console.error("Bot error:", error.message);
});

console.log("Telegram forwarder bot started.");
bot.launch();
