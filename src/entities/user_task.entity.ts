import { Entity, Column } from "typeorm";
import Model from "./model.entity";
import { Status } from "../lib/constant";

@Entity("User_tasks")
export class User_task extends Model {
  @Column()
  taskId: string;

  @Column()
  userId: string;

  @Column({ type: "enum", enum: Status })
  status: string;
}
