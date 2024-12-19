import { IsString, IsArray, IsInt, ArrayMinSize } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un permiso.' })
  @IsInt({ each: true })
  permissionIds?: number[];
}
