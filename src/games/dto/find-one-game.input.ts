import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindOneGameInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  range?: number;

  @Field({ nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  max_number?: number;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
