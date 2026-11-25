import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { SafeUser } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt-access.strategy';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: SafeUser }> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(
      dto.email,
      dto.name,
      passwordHash,
    );
    return { user };
  }

  async login(dto: LoginDto): Promise<{ user: SafeUser } & TokenPair> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokens(user.id, user.email);
    return {
      user: this.usersService.toSafeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<TokenPair> {
    const user = await this.usersService.findById(userId);
    if (!user?.refreshTokenHash) {
      throw new ForbiddenException('Access denied');
    }

    const isValid = await bcrypt.compare(
      this.hashToken(refreshToken),
      user.refreshTokenHash,
    );
    if (!isValid) {
      throw new ForbiddenException('Access denied');
    }

    return this.issueTokens(user.id, user.email);
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.setRefreshTokenHash(userId, null);
    return { message: 'Logged out' };
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.usersService.toSafeUser(user);
  }

  private async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const payload: JwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    const refreshHash = await bcrypt.hash(this.hashToken(refreshToken), 10);
    await this.usersService.setRefreshTokenHash(userId, refreshHash);

    return { accessToken, refreshToken };
  }

  // bcrypt truncates inputs at 72 bytes, so digest the JWT first
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
