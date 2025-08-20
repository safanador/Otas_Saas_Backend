import { Expose, Type } from 'class-transformer';
import { ResponseSupportResponseDto } from './response-support-response.dto';
import { User } from 'src/users/entities/user.entity';

export class ResponseSupportMessageDto {
  @Expose()
  id: number;

  @Expose()
  subject: string;

  @Expose()
  initialMessage: string;

  @Expose()
  status: 'pending' | 'answered' | 'in_progress' | 'closed';

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  closedAt: Date | null;

  @Expose()
  agency: {
    id: number;
    name: string;
  };

  @Expose()
  createdBy: {
    id: number;
    name: string;
    email: string;
  };

  @Expose()
  @Type(() => User)
  closedBy: {
    id: number;
    name: string;
    email: string;
  } | null;

  @Expose()
  @Type(() => ResponseSupportResponseDto)
  responses: ResponseSupportResponseDto[];
}
