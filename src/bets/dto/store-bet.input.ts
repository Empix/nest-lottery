import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class StoreBetInput {
  @Field()
  @IsNotEmpty({ message: "The numbers field can't be empty." })
  numbers: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "The game_id field can't be empty." })
  game_id: number;
}
