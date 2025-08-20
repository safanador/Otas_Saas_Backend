import { IsNotEmpty, IsString } from 'class-validator';

// add-support-response.dto.ts
export class AddSupportResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
