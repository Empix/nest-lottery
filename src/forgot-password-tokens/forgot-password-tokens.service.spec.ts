import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordTokensService } from './forgot-password-tokens.service';

describe('ForgotPasswordTokensService', () => {
  let service: ForgotPasswordTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgotPasswordTokensService],
    }).compile();

    service = module.get<ForgotPasswordTokensService>(ForgotPasswordTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
