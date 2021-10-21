import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreGameInput } from './dto/store-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  async findAll() {
    return await this.gamesRepository.find();
  }

  async findOne(id: number) {
    return await this.gamesRepository.findOne(id);
  }

  async store(data: StoreGameInput) {
    const game = this.gamesRepository.create(data);
    const gameSaved = await this.gamesRepository.save(game);

    return gameSaved;
  }

  async update(id: number, data: UpdateGameInput) {
    await this.gamesRepository.update({ id }, { ...data });
    const game = await this.findOne(id);

    return game;
  }
}
