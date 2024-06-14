import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";

@Entity("user_referral")
export class User_Referal extends Model {
  @OneToMany(() => User, (user) => user)
  @JoinColumn()
  referredFrom!: User;

  @Column({ default: null })
  referredFromId: string;

  @OneToMany(() => User, (user) => user)
  @JoinColumn()
  referredTo!: User;

  @Column({ default: null })
  referredToId: string;

  @Column({ default: 0 })
  point: number;
}
