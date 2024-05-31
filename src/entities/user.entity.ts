import { Entity, Column } from "typeorm";
import Model from "./model.entity";

export enum LeagueEnum {
  NOVICE = "Novice",
  ROOKIE = "Rookie",
  SENIOR = "Senior",
  ADVANCED = "Advanced",
  EXPERT = "Expert",
  MASTER = "Master",
  LEGEND = "Legend",
}

@Entity("users")
export class User extends Model {
  @Column()
  full_name: string;

  @Column()
  telegramUserId: string;

  @Column()
  telegramUserName: string;

  @Column({ nullable: true })
  referralLink: string;

  @Column({ type: "text", nullable: true })
  referredBy!: string | null;

  @Column({ default: 0 })
  points!: number;

  @Column({ default: 0 })
  referalPoints!: number;

  @Column({ default: 0 })
  socialPoints!: number;

  @Column({ type: "text", default: "idle" })
  status!: string;

  @Column({ default: 1 })
  perclick!: number;

  @Column({ default: 500 })
  limit!: number;

  @Column({ default: 0 })
  touches!: number;

  @Column({ default: 500 })
  max!: number;

  @Column({ default: 1 })
  multiTap!: number;

  @Column({ default: false})
  fullEnergy!: boolean;

  @Column({ default: false})
  tapGuru!: boolean;

  @Column({ default: 0 })
  friendsReferred!: number;

  @Column({ nullable: true })
  lastInteraction!: Date;

  @Column({
    default: LeagueEnum.NOVICE,
  })
  league!: string;
}
