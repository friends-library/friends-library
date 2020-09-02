import { AudioResource, TrackData } from '../types';
import FS from './fs';
import Player from './player';

export default class Service {
  public static audioSeekTo(position: number): Promise<void> {
    return Player.seekTo(position);
  }

  public static audioSkipBack(): Promise<void> {
    return Player.skipBack();
  }

  public static audioSkipNext(): Promise<void> {
    return Player.skipNext();
  }

  public static audioResume(): Promise<void> {
    return Player.resume();
  }

  public static audioPlayTrack(trackId: string, tracks: TrackData[]): Promise<void> {
    return Player.playPart(trackId, tracks);
  }

  public static audioPause(): Promise<void> {
    return Player.pause();
  }

  public static fsDeleteAllAudios(): Promise<void> {
    return FS.deleteAllAudios();
  }

  public static saveFreshAudioResources(resources: AudioResource[]): Promise<void> {
    return FS.writeFile(`audio/resources.json`, JSON.stringify(resources));
  }

  public static async downloadFile(
    relPath: string,
    networkUrl: string,
  ): Promise<number | null> {
    return FS.download(relPath, networkUrl);
  }

  public static async loadAudios(): Promise<AudioResource[] | null> {
    try {
      const resources = await FS.readJson(`audio/resources.json`);
      if (resourcesValid(resources)) {
        return resources;
      }
    } catch (err) {
      // ¯\_(ツ)_/¯
    }
    return null;
  }

  public static async fetchAudios(): Promise<AudioResource[] | null> {
    try {
      const res = await fetch(`https://api.friendslibrary.com/app-audios`);
      const resources = await res.json();
      if (resourcesValid(resources)) {
        return resources;
      }
    } catch (err) {
      // ¯\_(ツ)_/¯
    }
    return null;
  }
}

function resourcesValid(resources: any): resources is AudioResource[] {
  return (
    Array.isArray(resources) &&
    resources.every((r) => {
      return typeof r.artwork === `string` && Array.isArray(r.parts);
    })
  );
}
