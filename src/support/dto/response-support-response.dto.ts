import { Expose } from 'class-transformer';

export class ResponseSupportResponseDto {
  @Expose()
  id: number;

  @Expose()
  message: string;

  @Expose()
  isInternal: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  author: {
    id: number;
    name: string;
    email: string;
  };
}
