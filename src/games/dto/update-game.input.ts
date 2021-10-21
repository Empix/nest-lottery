import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';

@InputType()
export class UpdateGameInput {
  @Field({ nullable: true })
  @Length(2)
  @IsNotEmpty({ message: "The type field can't be null." })
  @IsOptional()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsNotEmpty({ message: "The range field can't be null." })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'The range field does not accept decimal places.' },
  )
  @IsOptional()
  range?: number;

  @Field({ nullable: true })
  @IsNotEmpty({ message: "The price field can't be null." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'The price field accepts only 2 decimal places.' },
  )
  @IsOptional()
  price?: number;

  @Field(() => Int, { nullable: true })
  @IsNotEmpty({ message: "The max_number field can't be null." })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'The max_number field does not accept decimal places.' },
  )
  @IsOptional()
  max_number?: number;

  @Field({ nullable: true })
  @IsNotEmpty({ message: "The color field can't be null." })
  @IsHexColor()
  @IsOptional()
  color?: string;
}
