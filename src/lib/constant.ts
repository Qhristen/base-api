export const referalPoint = 2500;
export const premiumUserReferalBonus = 50000;
export const bot_userName = `${process.env.TELEGRAM_BOT_NAME}`;
export const rankThresholds = [
  { name: "Novice", points: 2500 },
  { name: "Rookie", points: 10000 },
  { name: "Junior", points: 30000 },
  { name: "Senior", points: 50000 },
  { name: "Genius", points: 100000 },
  { name: "Advanced", points: 250000 },
  { name: "Expert", points: 500000 },
  { name: "Master", points: 1000000 },
  { name: "Legend", points: 5000000 },
];

export enum Status {
  pedning = "pedning",
  success = "completed",
}

export const tokenRequirements: { [level: number]: number } = {
  1: 200,
  2: 500,
  3: 1000,
  4: 2000,
  5: 4000,
  6: 8000,
  7: 16000,
  8: 25000,
  9: 50000,
  10: 100000,
};

export const RefillTokenRequirements: { [level: number]: number } = {
  1: 2000,
  2: 10000,
  3: 50000,
  4: 250000,
  5: 1250000,
};



export const inviteMilestones = [
  { count: 5, reward: 50000 },
  { count: 10, reward: 200000 },
  { count: 25, reward: 250000 },
  { count: 50, reward: 300000 },
  { count: 100, reward: 500000 },
  { count: 500, reward: 2500000 },
  { count: 1000, reward: 3500000 },
  { count: 10000, reward: 12000000 },
  { count: 50000, reward: 120000000 },
];