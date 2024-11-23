import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('login = :login', { login: signupDto.login })
        .execute();

      const hashedPassword = await bcrypt.hash(signupDto.password, 10);
      const now = Date.now();

      const newUser = this.userRepository.create({
        id: randomUUID(), // Явно задаем UUID
        login: signupDto.login,
        password: hashedPassword,
        version: 1,
        createdAt: now,
        updatedAt: now,
      });

      const savedUser = await this.userRepository.save(newUser);

      return {
        id: savedUser.id,
        login: savedUser.login,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { login: loginDto.login },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid login or password');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid login or password');
      }

      const payload = {
        id: user.id,
        login: user.login,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY || 'secret123123',
        expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
      });

      return { accessToken };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}
