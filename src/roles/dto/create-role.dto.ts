import {
  IsArray,
  IsInt,
  ArrayMinSize,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'El campo nombre no puede estar vacío.' })
  name: string;

  @IsIn(['global', 'agency'], { message: 'Debe seleccionar un tipo.' })
  scope: string;

  @IsOptional()
  @IsNumber({}, { message: 'El campo nombre no puede estar vacío.' })
  agencyId?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un permiso.' })
  @IsInt({ each: true })
  permissions: number[];
}
