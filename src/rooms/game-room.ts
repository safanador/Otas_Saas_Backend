// game-room.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameRoomService {
  // Método para generar un cartón de bingo
  generateBingoCard() {
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
}
