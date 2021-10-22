import { Field, ID, InputType } from '@nestjs/graphql';
import { FindOneGameInput } from 'src/games/dto/find-one-game.input';
import { FindOneUserInput } from 'src/users/dto/find-one-user.input';

@InputType()
export class FindOneBetInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  numbers?: string;

  @Field({ nullable: true })
  user?: FindOneUserInput;

  @Field({ nullable: true })
  game?: FindOneGameInput;

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
