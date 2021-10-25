import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateInput } from '../common/dto/paginate.input';
import { GamesService } from '../games/games.service';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { FindOneBetInput } from './dto/find-one-bet.input';
import { StoreBetInput } from './dto/store-bet.input';
import { Bet } from './entities/bet.entity';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bet)
    private betsRepository: Repository<Bet>,
    private gamesService: GamesService,
  ) {}

  async findAll(pagination: PaginateInput) {
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 10;

    const [bets, total] = await this.betsRepository.findAndCount({
      relations: ['user', 'game'],
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      data: bets,
      meta: {
        total,
        perPage,
        currentPage: page,
      },
    };
  }

  async findOne(conditions: FindOneBetInput) {
    const bet = await this.betsRepository.findOne(
      { ...conditions },
      {
        relations: ['user', 'game'],
      },
    );

    if (!bet) {
      throw new NotFoundException('Bet not found.');
    }

    return bet;
  }

  async findAllFromUser(user: User, pagination: PaginateInput) {
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 10;

    const [bets, total] = await this.betsRepository.findAndCount({
      where: { user_id: user.id },
      relations: ['user', 'game'],
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      data: bets,
      meta: {
        total,
        perPage,
        currentPage: page,
      },
    };
  }

  async storeMany(user: User, data: StoreBetInput[]) {
    await Promise.all(
      data.map(async (bet) => {
        return await this.gamesService.findOne({ id: bet.game_id });
      }),
    );

    const bets = data.map((bet) => ({
      ...bet,
      user,
      numbers: JSON.stringify(bet.numbers),
    }));
    const savedBets = await this.betsRepository.save(bets);

    const savedBetsWithRelations = await this.betsRepository.findByIds(
      savedBets.map((bet) => bet.id),
      {
        relations: ['user', 'game'],
      },
    );

    return savedBetsWithRelations;
  }
}
