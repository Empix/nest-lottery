import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateInput } from 'src/common/dto/paginate.input';
import { MailService } from 'src/mail/mail.service';
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
    private mailService: MailService,
  ) {}

  async findAll(pagination: PaginateInput) {
    const page = pagination?.page || 1;
    const perPage = pagination?.perPage || 10;

    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      data: users,
      meta: {
        total,
        perPage,
        currentPage: page,
      },
    };
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

    await this.mailService.sendMail({
      to: user.email,
      subject: `Seja muito bem vindo ${user.name}!`,
      template: 'welcome',
      context: {
        name: user.name,
      },
    });

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

    await this.mailService.sendMail({
      to: user.email,
      subject: `Que pena que você esteja indo ${user.name}!`,
      template: 'goodbye',
      context: {
        name: user.name,
      },
    });

    return true;
  }
}
