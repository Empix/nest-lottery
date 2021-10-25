import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { GqlAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PaginateInput } from 'src/common/dto/paginate.input';
import { User } from 'src/users/entities/user.entity';
import { BetsService } from './bets.service';
import { BetDTO } from './dto/bet.dto';
import { FindOneBetInput } from './dto/find-one-bet.input';
import { PaginatedBetDTO } from './dto/paginated-bet.dto';
import { StoreBetInput } from './dto/store-bet.input';

@Resolver()
export class BetsResolver {
  constructor(private readonly betsService: BetsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => PaginatedBetDTO)
  async findAllBets(
    @Args('pagination', { nullable: true })
    pagination: PaginateInput,
  ) {
    return await this.betsService.findAll(pagination);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => BetDTO)
  async findOneBet(
    @Args('conditions')
    conditions: FindOneBetInput,
  ) {
    return await this.betsService.findOne(conditions);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedBetDTO)
  async findAllBetsFromUser(
    @CurrentUser()
    user: User,
    @Args('pagination', { nullable: true })
    pagination: PaginateInput,
  ) {
    return await this.betsService.findAllFromUser(user, pagination);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => [BetDTO])
  async storeManyBets(
    @CurrentUser()
    currentUser: User,
    @Args({ name: 'data', type: () => [StoreBetInput] })
    data: StoreBetInput[],
  ) {
    return await this.betsService.storeMany(currentUser, data);
  }
}
