// Gateway principal de WebSocket para manejar salas
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { RoomsService } from './rooms.service';
import { LobbyCountdownService } from './lobby-room';

@WebSocketGateway({
  namespace: '/rooms',
  cors: {
    origin: 'http://localhost:3001', // URL del frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@UseGuards(WsJwtAuthGuard) // aplica el guard para verificar el token
export class RoomsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private connectedClients: Set<string> = new Set(); // Mantenemos un registro de los clientes conectados
  private connectedClientsEmails: Map<string, { id: string; email: string }> =
    new Map();
  private isBallotGenerating: boolean = false; // Variable de control para la generación de balotas
  private bingoResult: any = null; // Variable para guardar el resultado de Bingo

  constructor(
    private readonly lobbyCountdownService: LobbyCountdownService, // Inyecta LobbyCountdownService aquí
    private readonly roomsService: RoomsService,
  ) {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
    this.roomsService.setServer(this.server); // Pasa la instancia de Server a RoomsService
  }

  async handleConnection(client: Socket) {
    //console.log(`Client connected: ${client.id}`);
    // Obtener el email asegurándose de que sea un string
    const email = Array.isArray(client.handshake.headers.email)
      ? client.handshake.headers.email[0]
      : client.handshake.headers.email;
    if (email) {
      // Encuentra y elimina cualquier otro ID de cliente asociado con este email
      for (const [existingClientId, clientData] of this
        .connectedClientsEmails) {
        if (clientData.email === email) {
          this.connectedClientsEmails.delete(existingClientId);
          break;
        }
      }

      // Agrega el nuevo cliente con su ID y email
      this.connectedClientsEmails.set(client.id, { id: client.id, email });
    }

    this.roomsService.addToRoom('home', client); // Se conecta automáticamente a la sala "home"
    this.connectedClients.add(client.id); // Añadir cliente a la lista de conectados
    this.updateUserList(); // Emitir la lista de usuarios conectados

    this.updateUserCount(); //Enviar la cantidad de usuarios conectados
    // console.log(
    // `Cliente ${client.id} conectado a la sala "home" en handleConnection`,
    //);
  }

  handleDisconnect(client: Socket) {
    //console.log(`Client disconnected: ${client.id}`);
    this.roomsService.removeFromAllRooms(client);
    this.connectedClients.delete(client.id); // Eliminar cliente de la lista de conectados
    this.updateUserCount(); // Enviar la cantidad de usuarios conectados
    // Eliminar al cliente del mapa de conectados
    this.connectedClientsEmails.delete(client.id);
    this.updateUserList();
  }

  // Emitir la lista de usuarios conectados
  private updateUserList() {
    const usersList = Array.from(this.connectedClientsEmails.values());
    this.server.emit('userList', usersList); // Emitir la lista de usuarios conectados a todos los clientes
  }

  private updateUserCount() {
    this.server.emit('userCount', this.connectedClients.size); // Emitir la cantidad de usuarios conectados
  }

  @SubscribeMessage('startGame')
  async handleStartCountdown(client: Socket) {
    client.emit('redirect', 'lobby');
    // console.log(
    // `Cliente ${client.id} movido a la sala "lobby"  en handleStartCount`,
    //);

    //console.log('Iniciando el contador...');
    this.lobbyCountdownService.startCountdown(this.server); // Llama al método startCountdown pasando el servidor
    return { event: 'countdownStarted', data: 'Countdown started' }; // Retorna una respuesta si es necesario
  }

  // Evento cuando un usuario solicita generar un cartón de bingo
  @SubscribeMessage('createBingoCard')
  async createBingoCard(@ConnectedSocket() socket: Socket) {
    // Generar el cartón de bingo en el backend
    const bingoCard = this.roomsService.generateBingoCard();

    // Enviar el cartón de bingo al usuario
    socket.emit('bingoCardGenerated', bingoCard);

    // enviar el cartón de bingo a todos los demás usuarios en la sala
    this.server.emit('newBingoCard', bingoCard);
  }

  //Evento para actualizar bingoResults
  @SubscribeMessage('bingoResultRequest')
  bingoResultsRequest(@MessageBody() { bingoResult }: any) {
    console.log('Resultado recibido desde el cliente:', bingoResult); // Depuración para asegurarnos que el resultado es correcto

    if (bingoResult) {
      // Guardar el resultado en el servidor
      this.bingoResult = bingoResult;

      console.log('Resultado guardado en el servidor:', this.bingoResult); // Verificar que bingoResult fue asignado correctamente

      // Emitir el evento 'bingoResultResponse' a todos los clientes conectados con el nuevo resultado
      this.server.emit('bingoResultResponse', {
        bingoResultDownload: this.bingoResult,
      });
    } else {
      return;
    }
  }

  // Evento cuando un usuario hace "Bingo" y sus números seleccionados sí fueron validos
  @SubscribeMessage('checkBingo')
  checkBingo(
    @MessageBody() { selectedNumbers }: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const result = this.roomsService.handleCheckBingo(selectedNumbers);

    // Guardar el resultado en el servidor
    this.bingoResult = result;

    socket.emit('bingoChecked', { result });
  }

  // Evento para generar una balota
  @SubscribeMessage('generateBallot')
  generateBallot() {
    if (this.isBallotGenerating) {
      return; // Sale de la función si ya está en curso
    }

    this.isBallotGenerating = true; // Marca que la generación está en curso
    const ballot = this.roomsService.startBallotGeneration();

    // Enviar la balota a todos los usuarios
    this.server.emit('newBallot', ballot);
  }
}
