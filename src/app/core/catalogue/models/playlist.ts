/**
 * A curated list of songs.
 */
export interface Playlist {

  id?: number;

  name: string;
}

/**
 * Convenience for instantiating a `BehaviourSubject`.
 * <br>
 * I think it's pretty funky, but I like the way it grooves for now.
 */
export const EMPTY_PLAYLIST: Playlist = {
  name: "",
}