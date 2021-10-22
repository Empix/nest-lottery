import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOneGameInput } from './dto/find-one-game.input';
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

  async findOne(condition: FindOneGameInput) {
    const game = await this.gamesRepository.findOne({ ...condition });

    if (!game) {
      throw new NotFoundException('Game not found.');
    }

    return game;
  }

  async store(data: StoreGameInput) {
    try {
      const game = this.gamesRepository.create(data);
      const gameSaved = await this.gamesRepository.save(game);

      return gameSaved;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Duplicated game.');
      }

      throw new InternalServerErrorException('An unknown error has occurred.');
    }
  }

  async update(id: number, data: UpdateGameInput) {
    await this.gamesRepository.update({ id }, { ...data });
    const game = await this.findOne({ id });

    return game;
  }

  async delete(id: number) {
    const result = await this.gamesRepository.softDelete({ id });

    if (!result.affected) {
      throw new NotFoundException('Game not found.');
    }

    return true;
  }

  async restore(id: number) {
    await this.gamesRepository.restore({ id });
    const game = await this.gamesRepository.findOne({ id });

    return game;
  }
}
