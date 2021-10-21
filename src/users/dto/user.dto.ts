import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserDTO {
  @HideField()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @HideField()
  password: string;

  @Field()
  secure_id: string;

  @Field()
  role: string;

  @HideField()
  created_at: Date;

  @HideField()
  updated_at: Date;
}
