import { IsEnum } from 'class-validator';

export class UpdateSupportStatusDto {
  @IsEnum(['pending', 'answered', 'in_progress', 'closed'])
  status: 'pending' | 'answered' | 'in_progress' | 'closed';
}
