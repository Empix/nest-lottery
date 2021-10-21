import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

import { UserDTO } from './dto/user.dto';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserDTO])
  async findAllUsers() {
    return await this.usersService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserDTO)
  async findOneUser(
    @Args('id')
    id: number,
  ) {
    return await this.usersService.findOne({ id });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserDTO)
  async updateUser(
    @Args('id')
    id: number,
    @Args('data')
    data: UpdateUserInput,
  ) {
    return await this.usersService.update(id, data);
  }

  @Mutation(() => UserDTO)
  async storeUser(
    @Args('data')
    data: CreateUserInput,
  ) {
    return await this.usersService.store(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteUser(
    @CurrentUser()
    currentUser: User,
  ) {
    return await this.usersService.delete(currentUser);
  }
}
