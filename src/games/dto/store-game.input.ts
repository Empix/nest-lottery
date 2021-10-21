import { Field, InputType, Int } from '@nestjs/graphql';
import { IsHexColor, IsNotEmpty, IsNumber, Length } from 'class-validator';

@InputType()
export class StoreGameInput {
  @Field()
  @Length(2)
  @IsNotEmpty({ message: "The type field can't be null." })
  type: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  @IsNotEmpty({ message: "The range field can't be null." })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'The range field does not accept decimal places.' },
  )
  range: number;

  @Field()
  @IsNotEmpty({ message: "The price field can't be null." })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'The price field accepts only 2 decimal places.' },
  )
  price: number;

  @Field(() => Int)
  @IsNotEmpty({ message: "The max_number field can't be null." })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'The max_number field does not accept decimal places.' },
  )
  max_number: number;

  @Field()
  @IsNotEmpty({ message: "The color field can't be null." })
  @IsHexColor()
  color: string;
}
