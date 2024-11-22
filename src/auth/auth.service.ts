import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Tokens } from './interfaces/tokens.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PublicUser } from './interfaces/public-user.interface';

interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async signup(dto: SignupDto): Promise<PublicUser> {
    const existingUser = this.users.find((u) => u.login === dto.login);
    if (existingUser) {
      throw new ConflictException('Login already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const now = Date.now();

    const newUser: User = {
      id: uuidv4(),
      login: dto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);

    const { password, ...publicUser } = newUser;
    return publicUser;
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = this.users.find((u) => u.login === dto.login);
    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    return this.generateTokens(user);
  }

  async refresh(dto: RefreshTokenDto): Promise<Tokens> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refreshToken,
        { secret: process.env.JWT_SECRET_REFRESH_KEY },
      );

      const user = this.users.find((u) => u.id === payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = { id: user.id, login: user.login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
