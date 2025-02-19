import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  durationInDays?: number;

  @IsBoolean()
  @IsOptional()
  isTrial?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
