import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate as validateUUID, v4 as uuidv4 } from 'uuid';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findById(id: string): Track {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid tracks id');
    }
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Artist not found');
    }
    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    if (
      typeof createTrackDto.name !== 'string' ||
      !createTrackDto.name.trim() ||
      typeof createTrackDto.duration !== 'number' ||
      createTrackDto.duration <= 0
    ) {
      throw new BadRequestException('Invalid data type');
    }

    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid track id');
    }
    if (
      'albumId' in updateTrackDto &&
      updateTrackDto.albumId !== null &&
      !validateUUID(updateTrackDto.albumId)
    ) {
      throw new BadRequestException('Invalid albumId');
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks[trackIndex] = {
      ...this.tracks[trackIndex],
      ...updateTrackDto,
    };

    return this.tracks[trackIndex];
  }

  remove(id: string): void {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid track id');
    }

    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(trackIndex, 1);
  }

  updateArtistReference(artistId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === artistId) {
        return { ...track, artistId: null };
      }
      return track;
    });
  }

  updateAlbumReference(albumId: string): void {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId === albumId) {
        return { ...track, albumId: null };
      }
      return track;
    });
  }
}
