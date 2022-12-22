export const getMessageByPowerSource = (
  isPowerFromBattery: boolean,
) => {
  if (isPowerFromBattery) {
    return 'Електроенергія в будинку відсутня 😢';
  }

  return `⚡️ Електроенергія в будинку є ⚡️`;
};
