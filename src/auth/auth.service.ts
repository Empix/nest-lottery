import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Auth } from './dto/auth.dto';
import { LoginAuthInput } from './dto/login-auth.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validate({ email, password }: LoginAuthInput): Promise<Auth> {
    try {
      const user = await this.usersService.findOne({ email });

      if (!(await compare(password, user.password))) {
        throw new Error();
      }

      const payload = { sid: user.secure_id };
      const token = this.jwtService.sign(payload);

      return { token };
    } catch {
      throw new UnauthorizedException('The email or password are incorrect.');
    }
  }
}
