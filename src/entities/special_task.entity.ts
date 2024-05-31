import { Entity, Column } from "typeorm";
import Model from "./model.entity";

@Entity("special_league")
export class Special_Task extends Model {
  @Column()
  name: string;

  @Column({ default: 0 })
  point: number;

  @Column('jsonb', { array: false, nullable: true })
  activities: { name: string; link: string }[];


}
