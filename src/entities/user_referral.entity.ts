import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";

@Entity("user_referrals")
export class User_Referal extends Model {

  @Column()
  referredFromId: string;

  @Column()
  referredToId: string;

  @Column({ default: 0 })
  point: number;
}
