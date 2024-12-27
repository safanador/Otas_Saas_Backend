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
    const token = this.extractTokenFromCookies(request); // Extraer el token del encabezado Authorization
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
  private extractTokenFromCookies(request: any): string | null {
    const cookies = request.cookies; // Obtener las cookies del request
    if (!cookies || !cookies.authToken) {
      return null; // Retornar null si no hay cookies o si falta el token
    }
    return cookies.authToken; // Retornar el token de la cookie `authToken`
  }
}
