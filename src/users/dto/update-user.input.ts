import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsString()
  @Length(3, 64)
  @IsNotEmpty({ message: "The name field can't be null." })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsEmail(undefined, { message: 'This is a not valid email.' })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @Length(8, 128)
  @IsOptional()
  password?: string;
}
