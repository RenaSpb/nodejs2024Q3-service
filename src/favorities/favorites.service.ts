import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { validate as validateUUID } from 'uuid';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  private favorites = {
    artists: [] as string[],
    albums: [] as string[],
    tracks: [] as string[],
  };

  constructor(
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private tracksService: TracksService,
  ) {}

  findAll() {
    const artists = this.favorites.artists
      .map((id) => {
        try {
          return this.artistsService.findById(id);
        } catch {
          return null;
        }
      })
      .filter((artist) => artist !== null);

    const albums = this.favorites.albums
      .map((id) => {
        try {
          return this.albumsService.findById(id);
        } catch {
          return null;
        }
      })
      .filter((album) => album !== null);

    const tracks = this.favorites.tracks
      .map((id) => {
        try {
          return this.tracksService.findById(id);
        } catch {
          return null;
        }
      })
      .filter((track) => track !== null);

    return { artists, albums, tracks };
  }

  addTrack(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid track id');
    }

    try {
      this.tracksService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException('Track not found');
    }

    try {
      if (!this.favorites.tracks.includes(id)) {
        this.favorites.tracks.push(id);
      }
    } catch {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  removeTrack(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid track id');
    }

    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track not found in favorites');
    }
    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    try {
      this.albumsService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException('Album not found');
    }

    try {
      if (!this.favorites.albums.includes(id)) {
        this.favorites.albums.push(id);
      }
    } catch {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  removeAlbum(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album not found in favorites');
    }
    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid artist id');
    }

    try {
      this.artistsService.findById(id);
    } catch (error) {
      throw new UnprocessableEntityException('Artist not found');
    }

    try {
      if (!this.favorites.artists.includes(id)) {
        this.favorites.artists.push(id);
      }
    } catch {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  removeArtist(id: string) {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid artist id');
    }

    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist not found in favorites');
    }
    this.favorites.artists.splice(index, 1);
  }
}
