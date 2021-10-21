import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordTokensResolver } from './forgot-password-tokens.resolver';
import { ForgotPasswordTokensService } from './forgot-password-tokens.service';

describe('ForgotPasswordTokensResolver', () => {
  let resolver: ForgotPasswordTokensResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgotPasswordTokensResolver, ForgotPasswordTokensService],
    }).compile();

    resolver = module.get<ForgotPasswordTokensResolver>(ForgotPasswordTokensResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
