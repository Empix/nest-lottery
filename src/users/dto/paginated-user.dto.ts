import { Field, ObjectType } from '@nestjs/graphql';
import { PaginateDTO } from 'src/common/dto/paginate.dto';
import { UserDTO } from './user.dto';

@ObjectType()
export class PaginatedUserDTO {
  @Field(() => [UserDTO])
  data: UserDTO[];

  @Field()
  meta: PaginateDTO;
}
