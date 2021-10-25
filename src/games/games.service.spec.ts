import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenerateGame } from '../common/helpers/generateGame';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

describe('GamesService', () => {
  let gameService: GamesService;

  const mockGameRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    gameService = module.get<GamesService>(GamesService);
  });

  beforeEach(async () => {
    for (let method in mockGameRepository) {
      mockGameRepository[method].mockReset();
    }
  });

  it('Should be defined', () => {
    expect(gameService).toBeDefined();
  });

  describe('When find all games', () => {
    it('Should return an paginated list of games', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      mockGameRepository.findAndCount.mockReturnValue([[game], 1]);

      const result = await gameService.findAll(undefined);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toHaveLength(1);
      expect(mockGameRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('When find one game', () => {
    it('Should return a game by condition', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      mockGameRepository.findOne.mockReturnValue(game);

      const result = await gameService.findOne({ id: game.id });

      expect(result).toHaveProperty('id');
      expect(mockGameRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if game not found', async () => {
      mockGameRepository.findOne.mockReturnValue(undefined);

      const result = gameService.findOne({ id: 1 });

      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).not.toHaveProperty('id');
      expect(mockGameRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create game', () => {
    it('Should create a game', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      mockGameRepository.create.mockReturnValue(game);
      mockGameRepository.save.mockReturnValue(game);

      const result = await gameService.store(game);

      expect(result).toHaveProperty('id');
      expect(mockGameRepository.create).toHaveBeenCalledTimes(1);
      expect(mockGameRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if game is duplicated', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      mockGameRepository.create.mockReturnValue(game);
      mockGameRepository.save.mockImplementation(() => {
        throw { code: 'ER_DUP_ENTRY' };
      });

      const result = gameService.store(game);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      expect(result).not.toHaveProperty('id');
      expect(mockGameRepository.create).toHaveBeenCalledTimes(1);
      expect(mockGameRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if an unknown error occurs', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      mockGameRepository.create.mockReturnValue(game);
      mockGameRepository.save.mockImplementation(() => {
        throw { code: 'OTHER_ERROR' };
      });

      const result = gameService.store(game);

      await expect(result).rejects.toBeInstanceOf(InternalServerErrorException);
      expect(result).not.toHaveProperty('id');
      expect(mockGameRepository.create).toHaveBeenCalledTimes(1);
      expect(mockGameRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('When update game', () => {
    it('Should update a game', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      const newData = { color: '#FFF' };
      mockGameRepository.update.mockReturnValue(undefined);
      mockGameRepository.findOne.mockReturnValue({ ...game, ...newData });

      const result = await gameService.update(game.id, newData);

      expect(result).toHaveProperty('id');
      expect(result.color).toBe(newData.color);
      expect(mockGameRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockGameRepository.update).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if game not found to update', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      const newData = { color: '#FFF' };
      mockGameRepository.update.mockReturnValue(undefined);
      mockGameRepository.findOne.mockReturnValue(undefined);

      const result = gameService.update(game.id, newData);

      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).not.toHaveProperty('id');
      expect(mockGameRepository.update).toHaveBeenCalledTimes(1);
      expect(mockGameRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When soft delete a game', () => {
    it('Should soft delete a game', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      mockGameRepository.softDelete.mockReturnValue({ affected: 1 });

      const result = await gameService.delete(game.id);

      expect(result).toBe(true);
      expect(mockGameRepository.softDelete).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if game not found to soft delete', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      mockGameRepository.softDelete.mockReturnValue({ affected: 0 });

      const result = gameService.delete(game.id);

      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).not.toBe(true);
      expect(mockGameRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('When restore a game', () => {
    it('Should restore a game', async () => {
      const GameGenerator = new GenerateGame();
      const game = GameGenerator.generate();
      mockGameRepository.restore.mockReturnValue(undefined);
      mockGameRepository.findOne.mockReturnValue(game);

      const result = await gameService.restore(game.id);

      expect(result).toHaveProperty('id');
      expect(mockGameRepository.restore).toHaveBeenCalledTimes(1);
    });
  });
});
