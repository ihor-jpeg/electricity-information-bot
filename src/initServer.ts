import express from 'express';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';
import { EventQueue } from './EventQueue/EventQueue';

export const initServer = (
  botApiKey: string,
  port: number,
  groupChatId: number,
) => {
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
