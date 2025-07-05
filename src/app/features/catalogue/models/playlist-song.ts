/**
 * A `Song` within a `Playlist`.
 */
export interface PlaylistSong {
  id: number;

  url: string;

  title?: string;

  artist?: string;

  thumbnail_url?: string;
}
