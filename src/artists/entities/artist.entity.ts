// src/artists/entities/artist.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;
}
