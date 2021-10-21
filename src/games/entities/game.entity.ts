import { Bet } from 'src/bets/entities/bet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  range: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  price: number;

  @Column()
  max_number: number;

  @Column()
  color: string;

  @OneToMany(() => Bet, (bet) => bet.game)
  bets: Bet[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
