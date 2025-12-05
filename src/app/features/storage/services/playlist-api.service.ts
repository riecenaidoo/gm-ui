import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Playlist } from "../models/playlist";
import { HttpClient } from "@angular/common/http";
import { PlaylistsCreateRequest } from "../models/requests/playlists-create-request";
import { PlaylistsPatchRequest } from "../models/requests/playlists-patch-request";
import { environment } from "../../../../environments/environment";
import { PlaylistSongsCreateRequest } from "../models/requests/playlist-songs-create-request";
import { PlaylistSong } from "../models/playlist-song";

@Injectable({
  providedIn: "root",
})
export class PlaylistApiService {
  readonly #playlists = `${environment.apiStorage}/playlists`;

  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #http: HttpClient = inject(HttpClient);

  // ==========================================================================
  // API > Playlists
  // ==========================================================================

  public createPlaylist(
    playlist: PlaylistsCreateRequest,
  ): Observable<Playlist> {
    return this.#http.post<Playlist>(`${this.#playlists}`, playlist);
  }

  public getPlaylist(id: number): Observable<Playlist> {
    return this.#http.get<Playlist>(`${this.#playlists}/${id}`);
  }

  public getPlaylists(): Observable<Playlist[]> {
    return this.#http.get<Playlist[]>(`${this.#playlists}`);
  }

  /**
   * @param {string} title a non-blank, case-insensitive text fragment (`string`) that a {@link Playlist#title} must
   * match against.
   */
  public getPlaylistsByTitle(title: string): Observable<Playlist[]> {
    if (title.trim().length === 0) {
      throw new Error("Title must be non-blank.");
    }
    return this.#http.get<Playlist[]>(`${this.#playlists}?title=${title}`);
  }

  public updatePlaylist(
    id: number,
    patch: PlaylistsPatchRequest,
  ): Observable<Playlist> {
    if (Object.keys(patch).length === 0) {
      throw new Error("A patch must have at least one key-value pair.");
    }
    return this.#http.patch<Playlist>(`${this.#playlists}/${id}`, patch);
  }

  public deletePlaylist(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#playlists}/${id}`);
  }

  // ==========================================================================
  // API > PlaylistSongs
  // ==========================================================================

  public createPlaylistSong(
    id: number,
    request: PlaylistSongsCreateRequest,
  ): Observable<PlaylistSong> {
    return this.#http.post<PlaylistSong>(
      `${this.#playlists}/${id}/songs`,
      request,
    );
  }

  public getPlaylistSongs(id: number): Observable<PlaylistSong[]> {
    return this.#http.get<PlaylistSong[]>(`${this.#playlists}/${id}/songs`);
  }

  public deletePlaylistSong(id: number, song: PlaylistSong): Observable<void> {
    return this.#http.delete<void>(`${this.#playlists}/${id}/songs/${song.id}`);
  }
}
