import { Entity, Column } from "typeorm";
import Model from "./model.entity";
import { Status } from "../lib/constant";

@Entity("User_boosts")
export class User_boost extends Model {

  @Column()
  boostId: string;

  @Column()
  userId: string;

  @Column({ type: "enum", enum: Status})
  status: string;
}
