import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestampEntity } from '../../common/entities/base-timestamp.entity';

@Entity()
export class Book extends BaseTimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'varchar', length: 64 })
  publisher: string;

  @Column({ type: 'varchar', unique: true, length: 13 })
  isbn: string;
}
