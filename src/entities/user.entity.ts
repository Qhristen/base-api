import { Entity, Column, OneToMany, JoinColumn } from "typeorm";
import Model from "./model.entity";
import { User_Referal } from "./user_referral.entity";

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

  @Column({ nullable: true })
  telegramUserName: string;

  @Column({ nullable: true })
  referralLink: string;

  @Column({ type: "text", nullable: true })
  referredBy!: string | null;

  @Column({ default: 0 })
  points!: number;

  @Column({ default: 0 })
  autoBotpoints!: number;

  @Column({ default: false })
  autobot!: boolean;

  @Column({ default: 0 })
  referalPoints!: number;
  
  @Column({ default: 0 })
  totalPoint!: number;

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

  @Column("simple-json", { nullable: true })
  fullEnergy!: { min: number; max: number; active: boolean };

  @Column({ default: 1 })
  multiTap!: number;

  @Column({ default: 500 })
  multiTapPoint!: number;

  @Column({ default: 1 })
  multiTapLevel!: number;

  @Column({ default: 1 })
  chargeLevel!: number;

  @Column("simple-json", { nullable: true })
  tapGuru!: { min: number; max: number; active: boolean };

  @Column({ default: 0 })
  friendsReferred!: number;

  @Column({ default: 1 })
  refillSpeed!: number;

  @Column({ default: 1 })
  refillLevel!: number;

  @Column({ default: 2500 })
  refillPoint!: number;

  @Column({ nullable: true })
  lastInteraction!: Date;

  @Column({
    default: LeagueEnum.NOVICE,
  })
  league!: string;
}
