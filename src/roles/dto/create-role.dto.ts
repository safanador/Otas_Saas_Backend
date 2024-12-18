import { IsString, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionIds: number[];
}
