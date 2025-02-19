import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  price?: number;

  @IsString()
  durationInDays: number;

  @IsBoolean()
  @IsOptional()
  isTrial?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
