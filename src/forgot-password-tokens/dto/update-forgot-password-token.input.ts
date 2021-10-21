import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class UpdateForgotPasswordTokenInput {
  @Field()
  @IsNotEmpty({ message: "The token field can't be null." })
  token: string;

  @Field()
  @Length(8, 128)
  @IsNotEmpty({ message: "The new_password field can't be null." })
  new_password: string;
}
