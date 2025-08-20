import { Expose } from 'class-transformer';
import { Category } from 'src/categories/entities/category.entity';

export class ResponseTourDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  duration: string;

  @Expose()
  category: Category;

  @Expose()
  itinerary: { day: number; description: string }[];

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  agency: {
    id: number;
    name: string;
  };
}
