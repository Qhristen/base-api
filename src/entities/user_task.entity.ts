import { Entity, Column } from "typeorm";
import Model from "./model.entity";
import { Status } from "../lib/constant";

@Entity("user_tasks")
export class User_task extends Model {
  @Column({ nullable: true })
  taskId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: 0 })
  point: number;

  @Column({ nullable: true })
  type: string;

  @Column({ type: "enum", enum: Status })
  status: string;
}
