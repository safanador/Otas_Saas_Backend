import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSupportMessageDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  initialMessage: string;

  @IsOptional()
  @IsString()
  agencyId?: string;
}
