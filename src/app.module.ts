import { Module } from '@nestjs/common';
import { join } from 'path';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { BetsModule } from './bets/bets.module';
import { ForgotPasswordTokensModule } from './forgot-password-tokens/forgot-password-tokens.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      playground: false,
      autoSchemaFile: join(process.cwd(), '/src/schema.gql'),
    }),
    UsersModule,
    GamesModule,
    BetsModule,
    ForgotPasswordTokensModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
