import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateForgotPasswordTokenInput {
  @Field()
  @IsEmail(undefined, { message: 'This is a not valid email.' })
  email: string;
}
