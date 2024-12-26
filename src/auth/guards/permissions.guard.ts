import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken'; // Importar la librería para manejar tokens JWT
import { jwtConstants } from '../constants/jwt.contans';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) return true; // Si no se especifican permisos, permitir acceso.

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request); // Extraer el token del encabezado Authorization
    if (!token) {
      return false; // Bloquear acceso si no hay token
    }

    try {
      const decoded = jwt.verify(token, jwtConstants.secret); // Decodificar y validar el token
      const user = decoded as any; // Asignar el payload del token a una variable `user`
      request.user = user; // Adjuntar el usuario al request para futuros usos

      // Validar si el usuario tiene todos los permisos requeridos
      return requiredPermissions.every((permission) =>
        user.permissions?.includes(permission),
      );
    } catch {
      return false; // Bloquear acceso si el token no es válido
    }
  }

  // Método para extraer el token del encabezado Authorization
  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null; // Retornar null si el encabezado no existe o no es válido
    }
    return authHeader.split(' ')[1]; // Retornar el token sin el prefijo "Bearer"
  }
}
