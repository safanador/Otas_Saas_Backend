import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsUrl,
} from 'class-validator';

export class CreateAgencyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  phone2?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsNotEmpty()
  rnt: string;
}
