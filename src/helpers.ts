import { knownStatuses } from './constants';
import { Payload, Status } from './typedefs';

export const getMessageByStatus = (
  powerStatus: Status,
) => {
  if (powerStatus) {
    return `⚡️ Електроенергія в будинку є ⚡️`;
  }

  return 'Електроенергія в будинку відсутня 😢';
};

export const verifyPayload = (body: Record<string, any>) => {
  const entries = Object.entries(body);

  entries.forEach(([key, value]) => {
    if (!knownStatuses.includes(value)) {
      throw new Error(
        `Unknown value [${value}] for the key "${key}". Known values are [${knownStatuses}]`,
      );
    }
  });

  return body as Payload;
};
