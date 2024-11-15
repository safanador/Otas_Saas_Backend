import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
//import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) {
      //Emite evento de error si no hay token
      client.emit('authError', 'Token no encontrado');
      client.disconnect(); // Desconectar al cliente
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      client.user = payload; // Guardar el payload en el cliente WebSocket
      //context.switchToWs().getData().user = payload;
      return true;
    } catch {
      client.emit('authError', 'Token de autenticación invalido');
      client.disconnect(); // Desconectar al cliente
      return false;
    }
  }
}
