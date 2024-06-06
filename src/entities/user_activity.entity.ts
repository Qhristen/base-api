import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import Model from "./model.entity";
import { Special_Task } from "./special_task.entity";

@Entity("user_activity")
export class User_activity extends Model {
  @Column({ nullable: true })
  taskId!: string;

  @Column({ nullable: true })
  userId!: string;
  
  @Column({ nullable: true })
  activityId!: string;

  @Column({ default: false })
  clicked!: boolean;
}
