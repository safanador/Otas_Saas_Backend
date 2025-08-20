import {
  IsDateString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';
import { Type } from 'class-transformer';
import { CreateClientDto } from 'src/clients/dto/create-client.dto';

export class CreateBookingDto {
  @IsNumber()
  tourId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @ValidateIf((o) => !o.clientInfo) // Solo válido si no hay clientInfo
  clientId?: number;

  // Opción 2: Datos de nuevo cliente
  @ValidateIf((o) => !o.clientId)
  @ValidateNested()
  @Type(() => CreateClientDto)
  clientInfo?: CreateClientDto;

  @IsNumber()
  @IsPositive()
  participants: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  specialRequirements?: string;
}
