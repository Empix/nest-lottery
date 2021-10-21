import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { StoreBetInput } from './dto/store-bet.input';
import { Bet } from './entities/bet.entity';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bet)
    private betsRepository: Repository<Bet>,
  ) {}

  async findAll() {
    return await this.betsRepository.find();
  }

  async findOne(id: number) {
    return await this.betsRepository.findOne(id);
  }

  async findAllFromUser(user: User) {
    return await this.betsRepository.find({ user_id: user.id });
  }

  async storeMany(id: number, data: StoreBetInput[]) {
    /**
     * Talvez utilizar cascade aqui faça sentido
     * https://stackoverflow.com/questions/55098023/typeorm-cascade-option-cascade-ondelete-onupdate
     */
    const allBets = data.map((bet) => {
      bet['user_id'] = id;
      return bet;
    });

    const bets = this.betsRepository.create(allBets as any);
    await this.betsRepository.save(bets);

    const savedBets = await this.betsRepository.findByIds(bets);

    return savedBets;
  }
}
