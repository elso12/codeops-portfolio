import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The refresh token presented to rotate credentials',
    minLength: 20,
  })
  @IsString()
  @MinLength(20)
  refreshToken: string;
}
