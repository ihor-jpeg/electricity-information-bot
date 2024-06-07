import { ElectricityInfo } from "./ElectricityInformation";

export const getMessage = (
  powerStatus: number,
  { start, end }: ElectricityInfo,
) => {
  if (powerStatus) {
    return `⚡️ Електроенергія в будинку є ⚡️`;
  }

  const meta = start && end
    ? `\n\nЕлектроенергії не буде з ${start} до ${end}`
    : '';

  return `Електроенергія відсутня 😢`.concat(meta);
};
