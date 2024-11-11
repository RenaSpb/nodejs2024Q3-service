import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { validate as validateUUID, v4 as uuidv4 } from 'uuid';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks
  }

  findById(id: string): Track  {
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
      typeof createTrackDto.name !== 'string'
    ) {
      throw new BadRequestException('Body does not contain required fields');
    }
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid track id');
    }

    const trackIndex = this.tracks.findIndex(track => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks[trackIndex] = {
      ...this.tracks[trackIndex],
      ...updateTrackDto
    };

    return this.tracks[trackIndex];
  }

  remove(id: string): void {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid track id');
    }

    const trackIndex = this.tracks.findIndex(track => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(trackIndex, 1);
  }


}
