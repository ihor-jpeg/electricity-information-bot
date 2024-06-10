import * as crypto from 'crypto';
import { Request, Response } from 'express';

const ALGORIGHTM = 'sha256';
const WEBHOOK_SECRET = '8ad00a81cb1c36c869e282f478544205a43a23cd';

const signWithSha256 = (key: string, payload: string): string => (
  crypto
    .createHmac(ALGORIGHTM, key)
    .update(payload)
    .digest('hex')
);

const verifySignature = (req: Request) => {
  const signature = signWithSha256(
    WEBHOOK_SECRET,
    JSON.stringify(req.body),
  );

  const signatureFromHeaders = req.get('x-hub-signature-256');

  return `${ALGORIGHTM}=${signature}` === signatureFromHeaders;
};

export const verifyGitHubWebhook = (
  req: Request,
  res: Response,
) => {
  if (!verifySignature(req)) {
    res
      .status(401)
      .send('Missing or invalid token');

    throw new Error('Missing or invalid token');
  }
};

