import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import Model from "./model.entity";
import { Special_Task } from "./special_task.entity";

@Entity("activity")
export class Activity extends Model {
  @Column({ nullable: true })

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  link!: string;

  @ManyToOne(() => Special_Task, (sTask) => sTask.activities)
  specialTask!: Special_Task;

  @Column({ nullable: true })
  specialTaskId: string;
}
