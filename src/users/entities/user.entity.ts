import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Bet } from 'src/bets/entities/bet.entity';
import { ForgotPasswordToken } from 'src/forgot-password-tokens/entities/forgot-password-token.entity';
import { UserPasswordTransformer } from './transformers/user-password.transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ transformer: new UserPasswordTransformer() })
  password: string;

  @Column()
  @Generated('uuid')
  secure_id: string;

  @Column({ type: 'enum', enum: ['player', 'admin'], default: 'player' })
  role: string;

  @OneToMany(() => Bet, (bet) => bet.user, { cascade: true })
  bets: Bet[];

  @OneToOne(() => ForgotPasswordToken)
  forgotPasswordToken: ForgotPasswordToken;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
