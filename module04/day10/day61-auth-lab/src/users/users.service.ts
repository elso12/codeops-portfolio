import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  roles: string[];
  refreshHash: string | null;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async create(data: {
    email: string;
    passwordHash: string;
    roles?: string[];
  }): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: data.email,
      passwordHash: data.passwordHash,
      roles: data.roles ?? ['customer'],
      refreshHash: null,
    };
    this.users.push(user);
    return user;
  }

  async setRefreshHash(id: string, refreshHash: string | null): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.refreshHash = refreshHash;
    }
  }
}
