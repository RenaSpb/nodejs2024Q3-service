// src/config/ormconfig.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';
import { Favorites } from '../favorities/entities/favorites.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'home-library',
  entities: [User, Artist, Album, Track, Favorites],
  synchronize: true, // В продакшене должно быть false
  logging: true,
  // Добавляем опции для повторных попыток подключения
  retryAttempts: 10,
  retryDelay: 3000,
  // Добавляем опции для логирования
  logger: 'advanced-console',
};
