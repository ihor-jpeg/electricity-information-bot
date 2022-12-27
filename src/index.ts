import { Request, Response } from 'express';
import { getMessageByPowerSource } from './helpers';
import { initServer } from './initServer';

const {
  app,
  bot,
  groupChatId,
  jsonParser,
} = initServer();

app.post('/', jsonParser, async (req: Request, res: Response) => {
  const isPowerFromBattery = JSON.parse(req.body.powerStatus);

  console.log('hey');
  
  const message = getMessageByPowerSource(isPowerFromBattery);

  await bot.sendMessage(groupChatId, message);

  return res
    .status(200)
    .send('OK')
    .end();
});
