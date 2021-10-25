import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenerateUser } from '../common/helpers/generateUser';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';
import { ForgotPasswordToken } from './entities/forgot-password-token.entity';
import { ForgotPasswordTokensService } from './forgot-password-tokens.service';

describe('ForgotPasswordTokensService', () => {
  let FPTService: ForgotPasswordTokensService;

  const mockFPTRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
  };

  const mockUserRepository = {
    findOneOrFail: jest.fn(),
    save: jest.fn(),
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordTokensService,
        {
          provide: getRepositoryToken(ForgotPasswordToken),
          useValue: mockFPTRepository,
        },
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

    FPTService = module.get<ForgotPasswordTokensService>(
      ForgotPasswordTokensService,
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(FPTService).toBeDefined();
  });

  describe('When create a token for reset the password', () => {
    it('Should return the token', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      let token;
      mockUserRepository.findOneOrFail.mockReturnValue(user);
      mockFPTRepository.findOne.mockReturnValue(null);
      mockFPTRepository.create.mockImplementation((data) => {
        token = { token: data.token };
        return token;
      });
      mockFPTRepository.save.mockReturnValue(token);
      mockMailService.sendMail.mockReturnValue(undefined);

      const result = await FPTService.store({
        email: user.email,
      });

      expect(result).toEqual(true);
      expect(mockFPTRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockFPTRepository.create).toHaveBeenCalledTimes(1);
      expect(mockFPTRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(mockMailService.sendMail).toHaveBeenCalledTimes(1);
    });
  });

  describe('When update the password with the token', () => {
    it('Should update the password', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      const token = {
        token: 'token',
        user: user,
        updated_at: new Date(),
      };
      mockFPTRepository.findOne.mockReturnValue(token);
      mockFPTRepository.remove.mockReturnValue(undefined);
      mockUserRepository.save.mockReturnValue(undefined);

      const result = await FPTService.update({
        token: 'token',
        new_password: 'password',
      });

      expect(result).toEqual(true);
      expect(mockFPTRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockFPTRepository.remove).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if the token is expired', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      const expiredTime = new Date();
      expiredTime.setMinutes(expiredTime.getMinutes() - 40);
      const token = {
        token: 'token',
        user,
        updated_at: expiredTime,
      };
      mockFPTRepository.findOne.mockReturnValue(token);
      mockFPTRepository.remove.mockReturnValue(undefined);

      const result = FPTService.update({
        token: 'token',
        new_password: 'password',
      });

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      expect(mockFPTRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockFPTRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if the token is invalid', async () => {
      mockFPTRepository.findOne.mockReturnValue(undefined);

      const result = FPTService.update({
        token: 'token',
        new_password: 'password',
      });

      await expect(result).rejects.toBeInstanceOf(BadRequestException);
      expect(mockFPTRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
