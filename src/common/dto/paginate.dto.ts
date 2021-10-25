import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('PaginateMeta')
export class PaginateDTO {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  perPage: number;

  @Field(() => Int)
  currentPage: number;
}
