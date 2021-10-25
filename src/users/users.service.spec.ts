import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenerateUser } from '../common/helpers/generateUser';
import { MailService } from '../mail/mail.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;

  const mockUserRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softRemove: jest.fn(),
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    for (let method in mockUserRepository) {
      mockUserRepository[method].mockReset();
    }

    for (let method in mockMailService) {
      mockMailService[method].mockReset();
    }
  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('When find all users', () => {
    it('Should be list all users with pagination', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      mockUserRepository.findAndCount.mockReturnValue([[user], 1]);

      const result = await userService.findAll(undefined);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toHaveLength(1);
      expect(mockUserRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('When find one user', () => {
    it('Should be find one user by condition', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      mockUserRepository.findOne.mockReturnValue(user);

      const result = await userService.findOne({ id: user.id });

      expect(result).toHaveProperty('secure_id');
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('Should be throw error if user not found', async () => {
      mockUserRepository.findOne.mockReturnValue(undefined);

      const result = userService.findOne({ id: 1 });

      await expect(result).rejects.toBeInstanceOf(NotFoundException);
      expect(result).not.toHaveProperty('secure_id');
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create user', () => {
    it('Should be create user', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockReturnValue(user);
      mockUserRepository.findOne.mockReturnValue(undefined); // verifyEmailAvailability
      mockMailService.sendMail.mockReturnValue(undefined);

      const result = await userService.store(user);

      expect(result).toHaveProperty('secure_id');
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockMailService.sendMail).toHaveBeenCalledTimes(1);
    });

    it('Should be throw error if email already being used', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      mockUserRepository.findOne.mockReturnValue(user); // verifyEmailAvailability

      const result = userService.store(user);

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      expect(result).not.toHaveProperty('secure_id');
      expect(mockUserRepository.create).toHaveBeenCalledTimes(0);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When update user', () => {
    it('Should be update user', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      const newData = { name: 'John', email: 'john@gmail.com' };
      mockUserRepository.update.mockReturnValue(undefined);
      mockUserRepository.findOne
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce({ ...user, ...newData });

      const result = await userService.update(user as User, newData);

      expect(result.name).toBe(newData.name);
      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('Should be throw error if email already being used', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      mockUserRepository.findOne.mockReturnValue(user);

      const result = userService.update(user as User, { email: user.email });

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      expect(result).not.toHaveProperty('secure_id');
      expect(mockUserRepository.update).toHaveBeenCalledTimes(0);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When delete user', () => {
    it('Should be soft delete user', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      mockUserRepository.softRemove.mockReturnValue(undefined);
      mockUserRepository.findOne.mockReturnValue(user);
      mockMailService.sendMail.mockReturnValue(undefined);

      const result = await userService.delete(user as User);

      expect(result).toBe(true);
      expect(mockUserRepository.softRemove).toHaveBeenCalledTimes(1);
      expect(mockMailService.sendMail).toHaveBeenCalledTimes(1);
    });
  });
});
