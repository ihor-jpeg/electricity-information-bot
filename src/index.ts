import { Request, Response } from 'express';
import { getMessageByStatus, verifyPayload } from './helpers';
import { initServer } from './initServer';
import { HTTPStatus } from './typedefs';

const {
  app,
  bot,
  queue,
  groupChatId,
  jsonParser,
} = initServer();

app.post('/', jsonParser, async (req: Request, res: Response) => {
  let status = HTTPStatus.OK;
  let statusCode = 200;

  try {
    const { powerStatus } = verifyPayload(req.body);

    const message = getMessageByStatus(powerStatus);

    const sendMessage = async () => {
      await bot.sendMessage(groupChatId, message);
    };

    queue.add(sendMessage);
  } catch (error: any) {
    status = error.message;
    statusCode = 500;
  } finally {
    return res
      .status(statusCode)
      .send(status)
      .end();
  }
});
