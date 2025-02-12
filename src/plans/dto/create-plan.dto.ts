import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  durationInDays: number;

  @IsBoolean()
  @IsOptional()
  isTrial?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
