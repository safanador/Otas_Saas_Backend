import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    // Crear una agencia
    const agencyRepository = this.dataSource.getRepository(Agency);
    const agency = agencyRepository.create({
      name: 'Global Operators',
      logo: 'https://example.com/logo.png',
      email: 'info@globaloperators.com',
      phone: '+1234567890',
      address: '123 Main Street',
      city: 'Metropolis',
      state: 'Central',
      country: 'Countryland',
      rnt: '12345678',
    });
    await agencyRepository.save(agency);

    // Crear permisos
    const permissionRepository = this.dataSource.getRepository(Permission);
    const permissions = await permissionRepository.save([
      { id: 1, name: 'show dashboard' },
      { id: 2, name: 'list log' },
      { id: 3, name: 'list user' },
      { id: 4, name: 'create user' },
      { id: 5, name: 'show user' },
      { id: 6, name: 'update user' },
      { id: 7, name: 'delete user' },
      { id: 8, name: 'activate user' },
      { id: 9, name: 'list role' },
      { id: 10, name: 'create role' },
      { id: 11, name: 'show role' },
      { id: 12, name: 'update role' },
      { id: 13, name: 'delete role' },
    ]);

    // Crear roles
    const roleRepository = this.dataSource.getRepository(Role);
    const developerRole = roleRepository.create({
      name: 'Desarrollador',
      scope: 'global',
      permissions,
    });
    await roleRepository.save(developerRole);

    const userRole = roleRepository.create({
      name: 'Administrador',
      scope: 'agency',
      agency,
      permissions,
    });
    await roleRepository.save(userRole);

    // Crear usuarios
    const userRepository = this.dataSource.getRepository(User);
    const adminUser = userRepository.create({
      name: 'Sergio Afanador Bayona',
      email: 'sergioafanador102@gmail.com',
      password: await bcrypt.hash('admin123', 10),
      role: developerRole,
      phone: '+1234567890',
      address: '123 Admin Street',
      country: 'Countryland',
      state: 'Central',
      city: 'Metropolis',
    });

    const regularUser = userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: await bcrypt.hash('user123', 10),
      role: userRole,
      agency,
      phone: '+0987654321',
      address: '456 User Lane',
      country: 'Countryland',
      state: 'Central',
      city: 'Metropolis',
    });

    await userRepository.save([adminUser, regularUser]);

    console.log('Database seeding completed successfully!');
  }
}
