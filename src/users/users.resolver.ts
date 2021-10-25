import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

import { UserDTO } from './dto/user.dto';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FindOneUserInput } from './dto/find-one-user.input';
import { PaginateInput } from 'src/common/dto/paginate.input';
import { PaginatedUserDTO } from './dto/paginated-user.dto';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => PaginatedUserDTO)
  async findAllUsers(
    @Args('pagination', { nullable: true })
    pagination: PaginateInput,
  ) {
    return await this.usersService.findAll(pagination);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => UserDTO)
  async findOneUser(
    @Args('condition')
    condition: FindOneUserInput,
  ) {
    return await this.usersService.findOne(condition);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserDTO)
  async showUser(
    @CurrentUser()
    currentUser: User,
  ) {
    return currentUser;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserDTO)
  async updateUser(
    @CurrentUser()
    currentUser: User,
    @Args('data')
    data: UpdateUserInput,
  ) {
    return await this.usersService.update(currentUser, data);
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
