import { Expose } from 'class-transformer';

export class ResponseClientDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  address?: string;

  @Expose()
  dni?: string;

  @Expose()
  nationality?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
