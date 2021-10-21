import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import generateRandom from 'src/common/helpers/generateRandom';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateForgotPasswordTokenInput } from './dto/create-forgot-password-token.input';
import { UpdateForgotPasswordTokenInput } from './dto/update-forgot-password-token.input';
import { ForgotPasswordToken } from './entities/forgot-password-token.entity';

@Injectable()
export class ForgotPasswordTokensService {
  constructor(
    @InjectRepository(ForgotPasswordToken)
    private forgotPasswordTokenRepository: Repository<ForgotPasswordToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async store(data: CreateForgotPasswordTokenInput) {
    try {
      const user = await this.userRepository.findOneOrFail({
        email: data.email,
      });

      const token = generateRandom(10);

      const found = await this.forgotPasswordTokenRepository.findOne({ user });
      const created = this.forgotPasswordTokenRepository.create({ token });
      const forgotPasswordToken = found || created;

      await this.forgotPasswordTokenRepository.save({
        ...forgotPasswordToken,
        token,
        user,
      });
    } catch (error) {}

    return true;
  }

  async update(data: UpdateForgotPasswordTokenInput) {
    const token = await this.forgotPasswordTokenRepository.findOne(
      {
        token: data.token,
      },
      { relations: ['user'] },
    );

    if (!token || !token.user) throw new Error('iiihhhhhhhhh');

    token.user.password = data.new_password;
    await this.userRepository.save(token.user);

    await this.forgotPasswordTokenRepository.remove(token);

    return true;
  }
}