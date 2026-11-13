import { IsBoolean, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required and cannot be empty' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required and cannot be empty' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required and cannot be empty' })
  location: string;

  @IsISO8601({}, { message: 'eventDate must be a valid ISO 8601 date string (e.g. 2026-12-04T09:00:00.000Z)' })
  @IsNotEmpty({ message: 'eventDate is required' })
  eventDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Category is required and cannot be empty' })
  category: string;

  @IsBoolean({ message: 'isPublished must be a boolean value' })
  @IsNotEmpty({ message: 'isPublished is required' })
  isPublished: boolean;
}

