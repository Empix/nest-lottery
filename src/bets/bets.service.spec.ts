import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenerateUser } from '../common/helpers/generateUser';
import { User } from '../users/entities/user.entity';
import { GenerateBet } from '../common/helpers/generateBet';
import { BetsService } from './bets.service';
import { Bet } from './entities/bet.entity';
import { GamesService } from '../games/games.service';

describe('BetsService', () => {
  let betsService: BetsService;

  const mockBetRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findByIds: jest.fn(),
  };

  const mockGameService = {
    findOne: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetsService,
        {
          provide: getRepositoryToken(Bet),
          useValue: mockBetRepository,
        },
        {
          provide: GamesService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    betsService = module.get<BetsService>(BetsService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(betsService).toBeDefined();
  });

  describe('When find all bets', () => {
    it('Should return an paginated list of bets', async () => {
      const BetGenerator = new GenerateBet();
      const bet = BetGenerator.generate();
      mockBetRepository.findAndCount.mockReturnValue([[bet], 1]);

      const result = await betsService.findAll(undefined);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toHaveLength(1);
      expect(mockBetRepository.findAndCount).toHaveBeenCalledTimes(1);
    });

    it('Should return an paginated list of bets from specific user', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      const BetGenerator = new GenerateBet();
      const bet = BetGenerator.generate();
      mockBetRepository.findAndCount.mockReturnValue([[bet], 1]);

      const result = await betsService.findAllFromUser(user as User, undefined);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toHaveLength(1);
      expect(mockBetRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('When find one bet', () => {
    it('Should return a bet by condition', async () => {
      const BetGenerator = new GenerateBet();
      const bet = BetGenerator.generate();
      mockBetRepository.findOne.mockReturnValue(bet);

      const result = await betsService.findOne({ id: bet.id });

      expect(result).toHaveProperty('id');
      expect(mockBetRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if bet not found', async () => {
      mockBetRepository.findOne.mockReturnValue(undefined);

      const result = betsService.findOne({ id: 1 });

      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).not.toHaveProperty('id');
      expect(mockBetRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When store many bets', () => {
    it('Should return a list of stored bets', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      const BetGenerator = new GenerateBet();
      const bet = BetGenerator.generate();
      mockBetRepository.save.mockReturnValue([bet]);
      mockBetRepository.findByIds.mockReturnValue([bet]);
      mockGameService.findOne.mockReturnValue({});

      const result = await betsService.storeMany(user as User, [
        { ...bet, game_id: 1 },
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id');
      expect(mockBetRepository.save).toHaveBeenCalledTimes(1);
      expect(mockBetRepository.findByIds).toHaveBeenCalledTimes(1);
      expect(mockGameService.findOne).toHaveBeenCalledTimes(1);
    });

    it('Should return an error if the game does not exists', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      const BetGenerator = new GenerateBet();
      const bet = BetGenerator.generate();
      mockGameService.findOne.mockImplementation(() => {
        throw new NotFoundException('Game not found.');
      });

      const result = betsService.storeMany(user as User, [
        { ...bet, game_id: 1 },
      ]);

      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(mockBetRepository.save).toHaveBeenCalledTimes(0);
      expect(mockBetRepository.findByIds).toHaveBeenCalledTimes(0);
      expect(mockGameService.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
