import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";

@Entity("user_referrals")
export class User_Referal extends Model {
  @OneToMany(() => User, (user) => user)
  @JoinColumn()
  referredFrom!: User;

  @Column({ default: null })
  referredFromId: string;

  @ManyToOne(() => User, (user) => user.referrals, {eager: true,cascade: true, onDelete: "CASCADE"})
  @JoinColumn()
  referredTo!: User;

  @Column({ default: null })
  referredToId: string;

  @Column({ default: 0 })
  point: number;
}
