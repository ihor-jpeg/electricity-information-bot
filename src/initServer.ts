import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';
import { EventQueue } from './EventQueue';

export const initServer = () => {
  dotenv.config();

  const port = process.env.PORT || 9000;
  const botApiKey = process.env.BOT_API_KEY;
  const groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID;
  
  if (!botApiKey) {
    throw new Error('environment variable is not set: BOT_API_KEY');
  }
  
  if (!groupChatId) {
    throw new Error('environment variable is not set: TELEGRAM_GROUP_CHAT_ID');
  }
  
  const app = express();
  const queue = new EventQueue();
  const bot = new TelegramBot(
    botApiKey,
    { webHook: true },
  );
  
  const jsonParser = bodyParser.json();
  
  app.listen(port, async () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}\n`);
  });

  return {
    app,
    bot,
    queue,
    groupChatId,
    jsonParser,
  }
};
