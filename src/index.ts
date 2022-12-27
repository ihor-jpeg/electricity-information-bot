import { Request, Response } from 'express';
import { getMessageByStatus } from './helpers';
import { initServer } from './initServer';

const {
  app,
  bot,
  groupChatId,
  jsonParser,
} = initServer();

app.post('/', jsonParser, async (req: Request, res: Response) => {
  const powerStatus = JSON.parse(req.body.powerStatus);

  console.log('hey');
  
  const message = getMessageByStatus(powerStatus);

  await bot.sendMessage(groupChatId, message);

  return res
    .status(200)
    .send('OK')
    .end();
});
