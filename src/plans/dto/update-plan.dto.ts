import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  durationInDays?: number;

  @IsBoolean()
  @IsOptional()
  isTrial?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
