import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Auth } from './dto/auth.dto';
import { LoginAuthInput } from './dto/login-auth.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validate({ email, password }: LoginAuthInput): Promise<Auth> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('iiiihhhhhhhhhhh');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('iiiihhhhhhhhhhh2');
    }

    const payload = { sid: user.secure_id };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
