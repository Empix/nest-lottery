import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateForgotPasswordTokenInput } from './dto/create-forgot-password-token.input';
import { UpdateForgotPasswordTokenInput } from './dto/update-forgot-password-token.input';
import { ForgotPasswordTokensService } from './forgot-password-tokens.service';

@Resolver()
export class ForgotPasswordTokensResolver {
  constructor(
    private readonly forgotPasswordTokensService: ForgotPasswordTokensService,
  ) {}

  @Mutation(() => Boolean)
  async storeForgotPasswordToken(
    @Args()
    data: CreateForgotPasswordTokenInput,
  ) {
    return await this.forgotPasswordTokensService.store(data);
  }

  @Mutation(() => Boolean)
  async updateForgotPasswordToken(
    @Args('data')
    data: UpdateForgotPasswordTokenInput,
  ) {
    return await this.forgotPasswordTokensService.update(data);
  }
}
