import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailsService } from 'src/mails/mails.service';
import { ConfigModule } from '@nestjs/config';
import { Role } from 'src/roles/entities/role.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { RolesModule } from 'src/roles/roles.module';
import { AgenciesModule } from 'src/agencies/agencies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Agency]),
    ConfigModule.forRoot({ isGlobal: true }),
    RolesModule,
    AgenciesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, MailsService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
