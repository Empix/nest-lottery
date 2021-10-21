import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsResolver } from './bets.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bet } from './entities/bet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bet])],
  providers: [BetsResolver, BetsService],
})
export class BetsModule {}
