export const getMessage = (
  powerStatus: number,
) => {
  if (powerStatus) {
    return `⚡️ Електроенергія в будинку є ⚡️`;
  }

  return 'Електроенергія в будинку відсутня 😢';
};
