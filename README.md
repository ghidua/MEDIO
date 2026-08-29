# MEDIO

Telegram bot that forwards messages from one or more source channels to one or more destination channels.

## Setup

1. Install dependencies:
   - `npm install`
2. Copy env template:
   - `cp .env.example .env`
3. Fill `.env` values:
   - `TELEGRAM_BOT_TOKEN`
   - `SOURCE_CHAT_IDS` (comma-separated channel IDs)
   - `DESTINATION_CHAT_IDS` (comma-separated channel IDs, or one ID)

## Run

- `npm start`

## Notes

- Add the bot to source and destination channels with the required permissions.
- For private channels, use the numeric chat IDs (usually like `-100...`).