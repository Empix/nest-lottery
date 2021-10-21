import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StoreGameInput } from './dto/store-game.input';
import { GameDTO } from './dto/game.dto';
import { GamesService } from './games.service';
import { UpdateGameInput } from './dto/update-game.input';

@Resolver()
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => [GameDTO])
  async findAllGames() {
    return await this.gamesService.findAll();
  }

  @Query(() => GameDTO)
  async findOneGame(
    @Args('id')
    id: number,
  ) {
    return await this.gamesService.findOne(id);
  }

  @Mutation(() => GameDTO)
  async storeGame(
    @Args('data')
    data: StoreGameInput,
  ) {
    return await this.gamesService.store(data);
  }

  @Mutation(() => GameDTO)
  async updateGame(
    @Args('id')
    id: number,
    @Args('data')
    data: UpdateGameInput,
  ) {
    return await this.gamesService.update(id, data);
  }
}
