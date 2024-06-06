import { Entity, Column } from "typeorm";
import Model from "./model.entity";

@Entity("league_task")
export class League_Task extends Model {
  @Column()
  name: string;

  @Column({ default: 0 })
  point: number;
}
