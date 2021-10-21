import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GameDTO } from 'src/games/dto/game.dto';
import { UserDTO } from 'src/users/dto/user.dto';

@ObjectType('Bet')
export class BetDTO {
  @Field(() => ID)
  id: number;

  @Field()
  numbers: string;

  @Field()
  user: UserDTO;

  @Field()
  game: GameDTO;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
