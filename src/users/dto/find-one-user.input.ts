import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class FindOneUserInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  secure_id?: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
