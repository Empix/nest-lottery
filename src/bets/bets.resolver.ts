import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BetsService } from './bets.service';
import { BetDTO } from './dto/bet.dto';
import { StoreBetInput } from './dto/store-bet.input';

@Resolver()
export class BetsResolver {
  constructor(private readonly betsService: BetsService) {}

  @Query(() => [BetDTO])
  async findAllBets() {
    return await this.betsService.findAll();
  }

  @Query(() => BetDTO)
  async findOneBet(
    @Args('id')
    id: number,
  ) {
    return await this.betsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BetDTO])
  async findAllBetsFromUser(@CurrentUser() user: User) {
    return await this.betsService.findAllFromUser(user);
  }

  @Mutation(() => [BetDTO])
  async storeManyBets(
    @Args('user_id')
    id: number,
    @Args({ name: 'data', type: () => [StoreBetInput] })
    data: StoreBetInput[],
  ) {
    return await this.betsService.storeMany(id, data);
  }
}
