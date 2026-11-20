import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'The password (minimum 8 characters, maximum 64)',
    minLength: 8,
    maxLength: 64,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
