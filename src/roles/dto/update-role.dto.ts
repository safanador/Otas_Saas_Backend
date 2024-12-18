import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  permissionIds?: number[];
}
