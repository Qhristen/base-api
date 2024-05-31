import { Entity, Column } from "typeorm";
import Model from "./model.entity";

@Entity("ref_tasks")
export class Ref_Task extends Model {
  @Column()
  name: string;

  @Column({ default: 0 })
  point: number;

  @Column({ default: 0 })
  totalInvite: number;

}
