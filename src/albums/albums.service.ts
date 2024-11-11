import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as validateUUID, v4 as uuidv4 } from 'uuid';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  findAll(): Album[] {
    return this.albums;
  }

  findById(id: string): Album {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    const album = this.albums.find(album => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto
    };

    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    const albumIndex = this.albums.findIndex(album => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums[albumIndex] = {
      ...this.albums[albumIndex],
      ...updateAlbumDto
    };

    return this.albums[albumIndex];
  }

  remove(id: string): void {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    const albumIndex = this.albums.findIndex(album => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums.splice(albumIndex, 1);
  }

  updateArtistReference(artistId: string): void {
    this.albums = this.albums.map(album => {
      if (album.artistId === artistId) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }
}
