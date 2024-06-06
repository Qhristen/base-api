import { Entity, Column, OneToMany, JoinColumn } from "typeorm";
import Model from "./model.entity";
import { Activity } from "./activity.entity";

@Entity("special_task")
export class Special_Task extends Model {
  @Column()
  name: string;

  @Column({ default: 0 })
  point: number;

  @OneToMany(() => Activity, (activities) => activities.specialTask, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  activities: Activity[];

}
