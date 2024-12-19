import {
  IsArray,
  IsInt,
  ArrayMinSize,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'El campo nombre no puede estar vacío.' })
  name: string;

  @IsIn(['ota', 'system'], { message: 'Debe seleccionar un tipo.' })
  type: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un permiso.' })
  @IsInt({ each: true })
  permissionIds: number[];
}
