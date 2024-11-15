import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { RoomsService } from './rooms.service';

@Injectable()
export class LobbyCountdownService {
  //private lobbyTimeout: NodeJS.Timeout | null = null;
  private countdownInterval: NodeJS.Timeout | null = null;
  private countdownTime: number = 29; // Tiempo en segundos para la cuenta regresiva
  private countdownStarted: boolean = false; // Indicador para evitar múltiples inicios

  constructor(private readonly roomsService: RoomsService) {}

  // Método para iniciar el contador
  startCountdown(server: Server) {
    console.log('START COUNTDOWN FUE LLAMADO...');
    if (this.countdownStarted) return; // Evita iniciar múltiples contadores

    this.countdownStarted = true; // Marca que el contador ha comenzado
    console.log('Iniciando el contador...');

    // Empezamos el intervalo para emitir el tiempo restante
    this.countdownInterval = setInterval(() => {
      if (this.countdownTime > 0) {
        server.to('home').emit('countdown', this.countdownTime); // Emitir el tiempo restante
        console.log(`Contador: ${this.countdownTime}`); // Verificar el tiempo restante

        this.countdownTime--; // Decrementar el tiempo restante
      } else {
        // Cuando el contador llegue a 0, redirigir a la sala "game"
        server.to('home').emit('redirect', 'game'); // Emitir redirección
        console.log("Contador terminado. Redirigiendo a 'game'..."); // Verificar que la redirección está ocurriendo

        this.resetCountdown(); // Resetear el contador después de la redirección
      }
    }, 1000); // Emite el tiempo restante cada segundo
  }

  // Método para reiniciar el contador
  resetCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval); // Detener el intervalo de la cuenta regresiva
      console.log('Contador detenido'); // Verificar que el intervalo se detuvo

      this.countdownInterval = null; // Limpiar la referencia
    }

    this.countdownTime = 29; // Restablecer el tiempo a 30 segundos
    this.countdownStarted = false; // Restablecer el indicador
    console.log('Contador restablecido a 30 segundos'); // Verificar el restablecimiento
  }
}
