import { Entity, Column } from "typeorm";
import Model from "./model.entity";

export enum typeEnum {
  SPECIAL = "SPECIAL",
  OTHER_SPECIAL = "OTHER_SPECIAL",
  LEAGUE = "LEAGUE",
  REF = "REF",
}

@Entity("Tasks")
export class User extends Model {
  @Column()
  name: string;

  @Column({ default: 0 })
  points: number;

  @Column({nullable: true})
  link: string;

  @Column({
    type: "enum",
    enum: typeEnum,
  })
  type: typeEnum;
}
