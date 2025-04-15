import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsEmail()
  corporateEmail: string;

  @IsOptional()
  dob: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  countryCode?: string = '';

  @IsOptional()
  @IsString()
  preferredLanguage?: string = 'en';

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  agencyId: number | null;

  @IsOptional()
  @IsNumber()
  roleId: number;
}
