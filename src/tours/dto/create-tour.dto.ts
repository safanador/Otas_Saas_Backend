import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateTourDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  duration: string;

  @IsString()
  category: string;

  @IsArray()
  itinerary: { day: number; description: string }[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
