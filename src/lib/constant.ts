export const initialPoint = 2500;
export const premiumUserReferalBonus = 50000;
export const bot_userName = `${process.env.TELEGRAM_BOT_NAME}`;
export const rankThresholds = [
  { name: "Novice", points: initialPoint },
  { name: "Rookie", points: 10000 },
  { name: "Junior", points: 30000 },
  { name: "Senior", points: 50000 },
  { name: "Genius", points: 10000 },
  { name: "Advanced", points: 250000 },
  { name: "Expert", points: 500000 },
  { name: "Master", points: 1000000 },
  { name: "Legend", points: 5000000 },
];

export enum Status {
  pedning = "pedning",
  success = "completed",
}
