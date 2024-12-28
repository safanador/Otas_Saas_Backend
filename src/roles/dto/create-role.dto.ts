import {
  IsArray,
  IsInt,
  ArrayMinSize,
  IsNotEmpty,
  IsIn,
  IsOptional,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'El campo nombre no puede estar vacío.' })
  name: string;

  @IsIn(['global', 'agency'], { message: 'Debe seleccionar un tipo.' })
  scope: string;

  @IsOptional()
  agencyId?: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un permiso.' })
  @IsInt({ each: true })
  permissions: number[];
}
