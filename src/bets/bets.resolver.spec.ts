import { Test, TestingModule } from '@nestjs/testing';
import { BetsResolver } from './bets.resolver';
import { BetsService } from './bets.service';

describe('BetsResolver', () => {
  let resolver: BetsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetsResolver, BetsService],
    }).compile();

    resolver = module.get<BetsResolver>(BetsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
