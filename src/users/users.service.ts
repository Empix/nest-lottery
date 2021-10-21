import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(condition: Partial<User>) {
    const user = this.usersRepository.findOne(condition);

    return user;
  }

  async update(id: number, data: UpdateUserInput) {
    await this.usersRepository.update({ id }, { ...data });
    const user = await this.findOne({ id });

    return user;
  }

  async store(data: CreateUserInput) {
    const user = this.usersRepository.create(data);
    const userSaved = await this.usersRepository.save(user);

    return userSaved;
  }

  async delete(user: User) {
    const toDelete = await this.usersRepository.findOne(
      { id: user.id },
      {
        relations: ['bets'],
      },
    );
    await this.usersRepository.softRemove(toDelete);

    return true;
  }
}
