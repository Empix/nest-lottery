import { Field, InputType, Int } from '@nestjs/graphql';

@InputType('Paginate')
export class PaginateInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  perPage?: number;
}
