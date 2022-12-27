export const getMessageByStatus = (
  powerStatus: boolean,
) => {
  if (powerStatus) {
    return `⚡️ Електроенергія в будинку є ⚡️`;
  }

  return 'Електроенергія в будинку відсутня 😢';
};
