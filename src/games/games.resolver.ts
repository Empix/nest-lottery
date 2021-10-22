import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StoreGameInput } from './dto/store-game.input';
import { GameDTO } from './dto/game.dto';
import { GamesService } from './games.service';
import { UpdateGameInput } from './dto/update-game.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { FindOneGameInput } from './dto/find-one-game.input';

@Resolver()
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [GameDTO])
  async findAllGames() {
    return await this.gamesService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => GameDTO)
  async findOneGame(
    @Args('condition')
    condition: FindOneGameInput,
  ) {
    return await this.gamesService.findOne(condition);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => GameDTO)
  async storeGame(
    @Args('data')
    data: StoreGameInput,
  ) {
    return await this.gamesService.store(data);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => GameDTO)
  async updateGame(
    @Args('id')
    id: number,
    @Args('data')
    data: UpdateGameInput,
  ) {
    return await this.gamesService.update(id, data);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteGame(
    @Args('id')
    id: number,
  ) {
    return await this.gamesService.delete(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => GameDTO)
  async restoreGame(
    @Args('id')
    id: number,
  ) {
    return await this.gamesService.restore(id);
  }
}
