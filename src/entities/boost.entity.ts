import { Entity, Column } from "typeorm";
import Model from "./model.entity";

@Entity("boosts")
export class Boost extends Model {

  @Column()
  name: string;

  @Column({ default: 0 })
  limit: number;

  @Column()
  type: string;
}
