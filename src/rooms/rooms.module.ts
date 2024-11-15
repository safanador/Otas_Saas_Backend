import { Module } from '@nestjs/common';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';
import { LobbyCountdownService } from './lobby-room';

@Module({
  providers: [RoomsGateway, RoomsService, LobbyCountdownService],
  exports: [RoomsService, LobbyCountdownService],
})
export class RoomsModule {}
