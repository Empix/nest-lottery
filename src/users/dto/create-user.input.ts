import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @Length(3, 64)
  @IsNotEmpty({ message: "The name field can't be null." })
  name: string;

  @Field()
  @IsEmail(undefined, { message: 'This is a not valid email.' })
  email: string;

  @Field()
  @Length(8, 128)
  @IsNotEmpty({ message: "The password field can't be null." })
  password: string;
}
