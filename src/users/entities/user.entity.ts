import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestampEntity } from '../../common/entities/base-timestamp.entity';
import { UserType } from '../../common/enums/user-type.enum';

@Entity()
export class User extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32 })
  username: string;

  @Column({ type: 'varchar', length: 72 })
  password: string;

  @Column()
  type: UserType;
}
