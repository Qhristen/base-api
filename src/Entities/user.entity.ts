
import { Entity, Column } from 'typeorm';
import Model from './model.entity';



@Entity('Users')
export class User extends Model {

  @Column()
  telegram_username: string;

  @Column()
  telegram_user_id: string;


}
