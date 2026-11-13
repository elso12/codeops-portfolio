import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindEventsQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'isPublished must be a boolean string (true or false)' })
  isPublished?: boolean;

  @IsOptional()
  @IsIn(['eventDate', 'title'], {
    message: 'sortBy must be either "eventDate" or "title"',
  })
  sortBy?: 'eventDate' | 'title';

  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  @IsIn(['asc', 'desc'], {
    message: 'order must be either "asc" or "desc"',
  })
  order?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  limit?: number = 5;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
}

