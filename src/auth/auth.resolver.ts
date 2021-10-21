import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './dto/auth.dto';
import { LoginAuthInput } from './dto/login-auth.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async login(
    @Args('data')
    data: LoginAuthInput,
  ) {
    return await this.authService.validate(data);
  }
}
