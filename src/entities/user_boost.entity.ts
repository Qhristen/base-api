import { Entity, Column } from "typeorm";
import Model from "./model.entity";
import { Status } from "../lib/constant";

@Entity("user_boosts")
export class User_boost extends Model {

  @Column()
  boostId: string;

  @Column()
  userId: string;

  @Column({ default: 0 })
  point: number;

  @Column()
  type: string;

  @Column({ type: "enum", enum: Status})
  status: string;
}
