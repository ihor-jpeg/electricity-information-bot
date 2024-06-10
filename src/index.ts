import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { getMessage } from './helpers';
import { initServer } from './initServer';
import { exec } from 'child_process';
import a from 'pm2';
import { verifyGitHubWebhook } from './GithubWebhookController';

dotenv.config({ path: `.env.${process.env.NODE_ENV}`});

checkEnvVariables();

const port = Number(process.env.PORT) || 9000;
const botApiKey = String(process.env.BOT_API_KEY);
const groupChatId = Number(process.env.TELEGRAM_GROUP_CHAT_ID);

const {
  app,
  bot,
  queue,
  electricityInformationService,
  jsonParser,
} = initServer(
  botApiKey,
  port,
  groupChatId,
);

app.post('/', jsonParser, async (req: Request, res: Response) => {
  try {
    const { powerStatus } = req.body;

    const info = await electricityInformationService.getInfo();

    if (powerStatus === undefined) {
      throw new Error('The "powerStatus" variable is missing in payload')
    }

  const message = getMessage(
    Number(powerStatus),
    info,
  );

  const sendMessage = async () => {
    await bot.sendMessage(groupChatId, message);
  };

  queue.add(sendMessage);

  return res
    .status(200)
    .send('OK')
    .end();
  } catch (error) {
    console.log('Error occured', {
      error,
      body: req.body,
    });

    return res
    .status(200)
    .send('OK')
    .end();
  }
});

app.post('/github', jsonParser, async (req: Request, res: Response) => {
  console.log('GH WEBHOOK');

  try {
    verifyGitHubWebhook(req, res);

    exec('git pull origin master', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error pulling code: ${error}`);
        return res.status(500).send('Error pulling code');
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    exec('./start.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return res.status(500).send('Error executing script');
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  

    res.status(200).send('Code pulled and application restarted');
  } catch (error) {
    console.log('Got an error', error);
  }
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
