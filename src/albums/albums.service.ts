import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { validate as validateUUID, v4 as uuidv4 } from 'uuid';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => TracksService))
    private tracksService: TracksService,
  ) {}

  private albums: Album[] = [];

  findAll(): Album[] {
    return this.albums;
  }

  findById(id: string): Album {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  create(createAlbumDto: CreateAlbumDto): Album {
    if (
      typeof createAlbumDto.name !== 'string' ||
      !createAlbumDto.name.trim()
    ) {
      throw new BadRequestException('Invalid data type');
    }

    if (
      typeof createAlbumDto.year !== 'number' ||
      !Number.isInteger(createAlbumDto.year) ||
      createAlbumDto.year < 0
    ) {
      throw new BadRequestException('Invalid data type');
    }

    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };

    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    if (
      typeof updateAlbumDto.name !== 'string' ||
      !updateAlbumDto.name.trim()
    ) {
      throw new BadRequestException('Invalid data type');
    }

    if (
      typeof updateAlbumDto.year !== 'number' ||
      !Number.isInteger(updateAlbumDto.year) ||
      updateAlbumDto.year < 0
    ) {
      throw new BadRequestException('Invalid data type');
    }

    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums[albumIndex] = {
      ...this.albums[albumIndex],
      ...updateAlbumDto,
    };

    return this.albums[albumIndex];
  }

  remove(id: string): void {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }
    this.tracksService.updateAlbumReference(id);
    this.albums.splice(albumIndex, 1);
  }

  updateArtistReference(artistId: string): void {
    this.albums = this.albums.map((album) => {
      if (album.artistId === artistId) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }
}
