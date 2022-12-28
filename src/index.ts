import { Request, Response } from 'express';
import { getMessageByStatus } from './helpers';
import { initServer } from './initServer';

const {
  app,
  bot,
  queue,
  groupChatId,
  jsonParser,
} = initServer();

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
