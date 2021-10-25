import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { BetsResolver } from './bets.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bet } from './entities/bet.entity';
import { Game } from '../games/entities/game.entity';
import { GamesService } from '../games/games.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bet, Game])],
  providers: [BetsResolver, BetsService, GamesService],
})
export class BetsModule {}
