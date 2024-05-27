import { Entity, Column } from "typeorm";
import Model from "./model.entity";

export enum LeagueEnum {
  NOVICE = "NOVICE",
  ROOKIE = "ROOKIE",
  SENIOR = "SENIOR",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
  MASTER = "MASTER",
  LEGEND = "LEGEND",
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
  points!: number ;

  @Column({ default: 0 })
  referalPoints!: number ;

  @Column({ default: 0 })
  socialPoints!: number ;

  @Column({ default: 0 })
  friendsReferred!: number;

  @Column({ nullable: true })
  lastInteraction!: Date;

  @Column({
    type: "enum",
    enum: LeagueEnum,
    default: LeagueEnum.NOVICE,
  })
  league!: string;
}
