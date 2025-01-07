import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { BaseTimestampEntity } from '../../common/entities/base-timestamp.entity';
import { Book } from '../../books/entities/book.entity';

@Entity()
@Unique(['book', 'store'])
export class BookStore extends BaseTimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Store, (store) => store.id)
  @JoinColumn()
  store: number;

  @OneToOne(() => Book, (book) => book.id)
  @JoinColumn()
  book: number;

  @Column({ type: 'int', default: 0 })
  @Check('qty >= 0')
  qty: number;
}
