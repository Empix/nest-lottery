import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Game')
export class GameDTO {
  @Field(() => ID)
  id: number;

  @Field()
  type: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  range: number;

  @Field()
  price: number;

  @Field(() => Int)
  max_number: number;

  @Field()
  color: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
