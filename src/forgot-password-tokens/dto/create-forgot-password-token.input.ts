import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class CreateForgotPasswordTokenInput {
  @Field()
  @IsEmail(undefined, { message: 'This is a not valid email.' })
  email: string;
}
