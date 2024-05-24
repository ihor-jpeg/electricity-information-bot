export const getMessageByStatus = (
  powerStatus: number,
) => {
  if (powerStatus) {
    return `⚡️ Електроенергія в будинку є ⚡️`;
  }

  return 'Електроенергія в будинку відсутня 😢';
};
