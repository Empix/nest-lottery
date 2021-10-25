import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateDTO } from 'src/common/dto/paginate.dto';
import { GameDTO } from './game.dto';

@ObjectType()
export class PaginatedGameDTO {
  @Field(() => [GameDTO])
  data: GameDTO[];

  @Field()
  meta: PaginateDTO;
}
