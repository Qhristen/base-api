import { Entity, Column } from "typeorm";
import Model from "./model.entity";

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

  @Column("simple-array")
  activities: string[];

  @Column()
  type: string;
}
