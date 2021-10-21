import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserDTO {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  secure_id: string;

  @Field()
  role: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
