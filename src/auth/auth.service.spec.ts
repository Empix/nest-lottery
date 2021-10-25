import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { GenerateUser } from '../common/helpers/generateUser';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserService = {
    findOne: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Whe login', () => {
    it('Should return a token if password and email are correctly', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      const passwordHash = await bcrypt.hash(user.password, 10);
      mockUserService.findOne.mockResolvedValue({
        ...user,
        password: passwordHash,
      });
      mockJwtService.sign.mockReturnValue('token');

      const result = await authService.validate({
        email: user.email,
        password: user.password,
      });

      expect(result.token).toBe('token');
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('Should not return a token if password or email are incorrectly', async () => {
      const UserGenerator = new GenerateUser();
      const user = UserGenerator.generate();
      const passwordHash = await bcrypt.hash(user.password, 10);
      mockUserService.findOne.mockResolvedValue({
        ...user,
        password: passwordHash,
      });
      mockJwtService.sign.mockReturnValue('token');

      const result = authService.validate({
        email: user.email,
        password: 'AnyOtherPassword',
      });

      await expect(result).rejects.toBeInstanceOf(UnauthorizedException);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(0);
    });
  });
});
