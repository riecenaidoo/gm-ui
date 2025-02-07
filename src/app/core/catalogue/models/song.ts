/**
 * A reference to the location of a song on the internet.
 */
export interface Song {

  url: string;

}

/**
 * Convenience for instantiating a `BehaviourSubject`.
 * <br>
 * I think it's pretty funky, but I like the way it grooves for now.
 */
export const EMPTY_SONG: Song = {
  url: ""
}