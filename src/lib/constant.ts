export const initialPoint = 2500;
export const bot_userName = `VendilaBot`;
export const rankThresholds = [
  { name: "Novice", points: initialPoint },
  { name: "Rookie", points: 10000 },
  { name: "Senior", points: 50000 },
  { name: "Advanced", points: 100000 },
  { name: "Expert", points: 500000 },
  { name: "Master", points: 1000000 },
  { name: "Legend", points: 5000000 },
];

export enum Status {
  pedning = "pedning",
  success = "success",
}
