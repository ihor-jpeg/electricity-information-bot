import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { getMessageByStatus } from './helpers';
import { initServer } from './initServer';

dotenv.config({ path: `.env.${process.env.NODE_ENV}`});

checkEnvVariables();

const port = Number(process.env.PORT) || 9000;
const botApiKey = String(process.env.BOT_API_KEY);
const groupChatId = Number(process.env.TELEGRAM_GROUP_CHAT_ID);

const {
  app,
  bot,
  queue,
  jsonParser,
} = initServer(
  botApiKey,
  port,
  groupChatId,
);

app.post('/', jsonParser, async (req: Request, res: Response) => {
  const powerStatus = JSON.parse(req.body.powerStatus);

  const message = getMessageByStatus(powerStatus);

  const sendMessage = async () => {
    await bot.sendMessage(groupChatId, message);
  };

  queue.add(sendMessage);

  return res
    .status(200)
    .send('OK')
    .end();
});

function checkEnvVariables() {
  const botApiKey = process.env.BOT_API_KEY;
  const groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID;
  
  if (!botApiKey) {
    throw new Error('environment variable is not set: BOT_API_KEY');
  }
  
  if (!groupChatId) {
    throw new Error('environment variable is not set: TELEGRAM_GROUP_CHAT_ID');
  }
}