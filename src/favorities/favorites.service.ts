import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Favorites } from './entities/favorites.entity';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: []
  };

  constructor(
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private tracksService: TracksService
  ) {}

  async findAll() {
    return {
      artists: this.favorites.artists.map(id => this.artistsService.findById(id)),
      albums: this.favorites.albums.map(id => this.albumsService.findById(id)),
      tracks: this.favorites.tracks.map(id => this.tracksService.findById(id))
    };
  }

  async addTrack(id: string) {
    try {
      const track = await this.tracksService.findById(id);
      if (!this.favorites.tracks.includes(id)) {
        this.favorites.tracks.push(id);
      }
    } catch {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  async removeTrack(id: string) {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track not found in favorites');
    }
    this.favorites.tracks.splice(index, 1);
  }

  async addAlbum(id: string) {
    try {
      const album = await this.albumsService.findById(id);
      if (!this.favorites.albums.includes(id)) {
        this.favorites.albums.push(id);
      }
    } catch {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  async removeAlbum(id: string) {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album not found in favorites');
    }
    this.favorites.albums.splice(index, 1);
  }

  async addArtist(id: string) {
    try {
      const artist = await this.artistsService.findById(id);
      if (!this.favorites.artists.includes(id)) {
        this.favorites.artists.push(id);
      }
    } catch {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  async removeArtist(id: string) {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist not found in favorites');
    }
    this.favorites.artists.splice(index, 1);
  }
}
