import { Entity, Column } from "typeorm";
import Model from "./model.entity";

@Entity("boosts")
export class Boost extends Model {

  @Column()
  name: string;

  @Column({ default: 0 })
  limit!: number;

  @Column({ default: 0 })
  max!: number;

  @Column({ default: 0 })
  point!: number;

  @Column()
  type: string;
}
