import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateDTO } from 'src/common/dto/paginate.dto';
import { BetDTO } from './bet.dto';

@ObjectType()
export class PaginatedBetDTO {
  @Field(() => [BetDTO])
  data: BetDTO[];

  @Field()
  meta: PaginateDTO;
}
