import { Entity, Column, OneToMany } from "typeorm";
import Model from "./model.entity";
import { User_activity } from "./user_activity.entity";

export enum typeEnum {
  SPECIAL = "SPECIAL",
  OTHER_SPECIAL = "OTHER_SPECIAL",
  LEAGUE = "LEAGUE",
  REF = "REF",
}

@Entity("tasks")
export class Task extends Model {
  @Column()
  name: string;

  @Column({ default: 0 })
  point: number;

  @OneToMany(() => User_activity, (activities) => activities)
  activities: User_activity[]

  @Column()
  type: string;
}
