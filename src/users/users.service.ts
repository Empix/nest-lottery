import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { FindOneUserInput } from './dto/find-one-user.input';
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

  async findOne(condition: FindOneUserInput) {
    const user = await this.usersRepository.findOne({ ...condition });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async verifyEmailAvailability(email: string) {
    const emailExists = await this.usersRepository.findOne({ email });

    if (emailExists) {
      throw new BadRequestException('This email has already been used.');
    }
  }

  async update(user: User, data: UpdateUserInput) {
    if (data.email) {
      await this.verifyEmailAvailability(data.email);
    }

    await this.usersRepository.update({ id: user.id }, { ...data });
    const updatedUser = await this.usersRepository.findOne({ id: user.id });

    return updatedUser;
  }

  async store(data: CreateUserInput) {
    await this.verifyEmailAvailability(data.email);

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
