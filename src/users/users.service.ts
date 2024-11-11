// src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { validate as validateUUID } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...user }) => user);
  }

  async findById(id: string): Promise<Omit<User, 'password'>> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid user id');
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (
      typeof createUserDto.login !== 'string' ||
      typeof createUserDto.password !== 'string' ||
      !createUserDto.login.trim() ||
      !createUserDto.password.trim()
    ) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const now = Date.now();

    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid user id');
    }
    if (
      typeof updatePasswordDto.oldPassword !== 'string' ||
      typeof updatePasswordDto.newPassword !== 'string' ||
      !updatePasswordDto.oldPassword.trim() ||
      !updatePasswordDto.newPassword.trim()
    ) {
      throw new BadRequestException('Body does not contain required fields');
    }

    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    const user = this.users[userIndex];

    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new ForbiddenException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );

    const updatedUser: User = {
      ...user,
      password: hashedNewPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    this.users[userIndex] = updatedUser;

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string): Promise<void> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid user id');
    }

    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(userIndex, 1);
  }
}
