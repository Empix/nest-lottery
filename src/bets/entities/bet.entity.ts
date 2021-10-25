import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Game } from '../../games/entities/game.entity';

@Entity()
export class Bet {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  numbers: string;

  @ManyToOne(() => User, (user) => user.bets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => Game, (game) => game.bets)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column()
  game_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
