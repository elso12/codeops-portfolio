import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SafeUser, User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    const target = email.trim().toLowerCase();
    return this.users.find((u) => u.email === target);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async create(email: string, name: string, passwordHash: string): Promise<SafeUser> {
    const normalizedEmail = email.trim().toLowerCase();
    if (await this.findByEmail(normalizedEmail)) {
      throw new ConflictException('Email is already registered');
    }

    const user: User = {
      id: randomUUID(),
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
      refreshTokenHash: null,
      createdAt: new Date(),
    };

    this.users.push(user);
    return this.toSafeUser(user);
  }

  async setRefreshTokenHash(userId: string, hash: string | null): Promise<void> {
    const user = await this.findById(userId);
    if (user) {
      user.refreshTokenHash = hash;
    }
  }

  toSafeUser(user: User): SafeUser {
    const { passwordHash, refreshTokenHash, ...safeUser } = user;
    return safeUser;
  }
}
