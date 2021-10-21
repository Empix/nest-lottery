import { Module } from '@nestjs/common';
import { ForgotPasswordTokensService } from './forgot-password-tokens.service';
import { ForgotPasswordTokensResolver } from './forgot-password-tokens.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForgotPasswordToken } from './entities/forgot-password-token.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForgotPasswordToken, User])],
  providers: [ForgotPasswordTokensResolver, ForgotPasswordTokensService],
})
export class ForgotPasswordTokensModule {}
