import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Agency } from 'src/agencies/entities/agency.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['permissions', 'agency'] });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions', 'agency'],
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, scope, agencyId, permissions } = createRoleDto;

    const agency = agencyId
      ? await this.agencyRepository.findOne({ where: { id: agencyId } })
      : null;

    if (agencyId && !agency) {
      throw new NotFoundException('Agencia no encontrada');
    }

    const permissionEntities =
      await this.permissionRepository.findByIds(permissions);

    if (permissionEntities.length !== permissions.length) {
      throw new NotFoundException('Algunos permisos no fueron encontrados');
    }

    const role = this.roleRepository.create({
      name,
      scope,
      agency,
      permissions: permissionEntities,
    });
    return this.roleRepository.save(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    const { name, permissions, agencyId, scope } = updateRoleDto;

    if (name) {
      role.name = name;
    }

    if (scope) {
      role.scope = scope;
    }

    if (agencyId) {
      const agency = await this.agencyRepository.findOne({
        where: { id: agencyId },
      });

      if (!agency) {
        throw new NotFoundException('Agencia no encontrada');
      }

      role.agency = agency;
    }

    if (permissions) {
      const permissionEntities =
        await this.permissionRepository.findByIds(permissions);

      if (permissionEntities.length !== permissions.length) {
        throw new NotFoundException('Algunos permisos no fueron encontrados');
      }
      role.permissions = permissionEntities;
    }

    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
