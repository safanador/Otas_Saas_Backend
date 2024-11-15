import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class RoomsService {
  private server: Server; // Agrega una propiedad para almacenar el servidor
  private rooms: { [key: string]: Set<string> } = {
    home: new Set(),
    lobby: new Set(),
    game: new Set(),
  };

  setServer(server: Server) {
    this.server = server;
  }

  addToRoom(roomName: string, client: Socket) {
    this.leaveAllRooms(client);
    this.rooms[roomName].add(client.id);
    client.join(roomName);
  }

  removeFromAllRooms(client: Socket) {
    this.leaveAllRooms(client);
  }

  private leaveAllRooms(client: Socket) {
    for (const room of Object.keys(this.rooms)) {
      if (this.rooms[room].has(client.id)) {
        this.rooms[room].delete(client.id);
        client.leave(room);
      }
    }
  }

  //private generatedCards: any[] = []; // Para almacenar los cartones generados
  private generatedBalls: number[] = []; // Para almacenar las balotas generadas
  private ballotPool: number[] = []; // Pool de balotas (1-75)
  private isGameActive: boolean = false;
  private ballotInterval: NodeJS.Timeout | null = null; // Referencia al intervalo para generación de balotas

  constructor() {
    // Inicializar el pool de balotas del 1 al 75
    this.ballotPool = Array.from({ length: 75 }, (_, i) => i + 1);
  }

  // Método para generar un cartón de bingo único
  generateBingoCard(): (number | string)[][] {
    const card = [];
    const columns = [
      { letter: 'B', range: [1, 15] },
      { letter: 'I', range: [16, 30] },
      { letter: 'N', range: [31, 45] },
      { letter: 'G', range: [46, 60] },
      { letter: 'O', range: [61, 75] },
    ];

    columns.forEach((col) => {
      // Generamos 5 números únicos dentro del rango de la columna
      const columnNumbers = this.generateUniqueRandomNumbers(
        col.range[0],
        col.range[1],
        5,
      );
      // Insertamos la columna en el cartón
      card.push(columnNumbers);
    });

    // Hacemos el espacio libre en la celda [3,3]
    card[2][2] = 'FREE';

    // Transformamos el array de columnas en filas
    const bingoCard = Array.from({ length: 5 }, (_, rowIndex) =>
      columns.map((_, colIndex) => card[colIndex][rowIndex]),
    );

    return bingoCard;
  }

  // Método auxiliar para generar números únicos aleatorios en un rango
  private generateUniqueRandomNumbers(
    min: number,
    max: number,
    count: number,
  ): number[] {
    const numbers = new Set<number>();
    while (numbers.size < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.add(num);
    }
    return Array.from(numbers);
  }

  // Método para iniciar la generación de balotas
  startBallotGeneration() {
    this.isGameActive = true;

    // Configurar el intervalo para generar una balota cada 5 segundos
    this.ballotInterval = setInterval(() => {
      if (this.isGameActive && this.ballotPool.length > 0) {
        const ballot = this.generateBallot();
        if (ballot !== null) {
          console.log(ballot);
          // Emitir la balota generada a todos los clientes conectados
          this.server.emit('ballotGenerated', ballot);
        } else {
          // Si ya no quedan balotas, limpiar el intervalo
          this.stopBallotGeneration();
        }
      }
    }, 5000);
  }

  // Método para detener la generación de balotas
  stopBallotGeneration() {
    this.isGameActive = false;
    if (this.ballotInterval) {
      clearInterval(this.ballotInterval);
      this.ballotInterval = null;
    }
  }

  // Método para generar una balota aleatoria y actualizar el estado
  private generateBallot() {
    if (this.ballotPool.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * this.ballotPool.length);
    const ballot = this.ballotPool.splice(randomIndex, 1)[0];
    this.generatedBalls.push(ballot);
    return ballot;
  }

  // Método para manejar el evento `checkBingo`
  // Validación principal que verifica las diferentes condiciones de Bingo
  validateBingo(cardState: boolean[][]): string | null {
    //detiene la generación de balotas
    this.stopBallotGeneration();
    // Validación de filas
    for (const row of cardState) {
      if (row.every((cell) => cell)) return 'Bingo Horizontal';
    }

    // Validación de columnas
    for (let col = 0; col < 5; col++) {
      if (cardState.every((row) => row[col])) return 'Bingo Vertical';
    }

    // Validación de diagonales
    if (cardState.every((row, idx) => row[idx]))
      return 'Bingo Diagonal Principal';
    if (cardState.every((row, idx) => row[4 - idx]))
      return 'Bingo Diagonal Secundaria';

    // Validación de cuatro esquinas
    if (
      cardState[0][0] &&
      cardState[0][4] &&
      cardState[4][0] &&
      cardState[4][4]
    ) {
      return 'Bingo Cuatro Esquinas';
    }

    // Validación de cartón completo
    if (cardState.every((row) => row.every((cell) => cell)))
      return 'Bingo Cartón Completo';

    // No hay bingo
    this.startBallotGeneration();
    return null;
  }

  // Función para manejar el evento checkBingo y responder al cliente
  handleCheckBingo(cardState: boolean[][]): string | null {
    const result = this.validateBingo(cardState);
    return result ? result : 'Descalificado';
  }
}
