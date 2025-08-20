import { Module } from '@nestjs/common';
import { SupportMessageService } from './support.service';
import { SupportMessageController } from './support.controller';
import { SupportMessage } from './entities/support.entity';
import { User } from 'src/users/entities/user.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportResponse } from './entities/support-response.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportMessage, SupportResponse, User, Agency]), // Asegúrate de incluir todas las entidades necesarias
  ],
  controllers: [SupportMessageController],
  providers: [SupportMessageService],
})
export class SupportModule {}
