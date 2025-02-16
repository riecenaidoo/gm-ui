import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {Playlist} from "../../models/playlist";
import {HttpClient} from "@angular/common/http";
import {CreatePlaylistRequest} from "../../../../features/catalogue/models/requests/create-playlist-request";
import {Song} from "../../models/song";
import {PatchOperation} from "../../models/requests/patch-operation";
import {PlaylistsSongsPatchRequest} from "../../models/requests/playlists-songs-patch-request";

@Injectable({
  providedIn: 'root'
})
export class PlaylistRepositoryService {

  public constructor(private http: HttpClient) {
  }

  // ------ API ------

  public findAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>("http://localhost:8080/api/v1/playlists");
  }

  public findById(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`http://localhost:8080/api/v1/playlists/${id}`);
  }

  public getPlaylistSongs(id: number): Observable<Song[]> {
    return this.http.get<Song[]>(`http://localhost:8080/api/v1/playlists/${id}/songs`);
  }

  /**
   * If our API returns the ID, we should be able to construct a `Playlist` using the request & response.
   * <br>
   * TODO return `Observable<Playlist>`
   *
   * @param {CreatePlaylistRequest} playlist
   * @returns {Observable<void>}
   */
  public createPlaylist(playlist: CreatePlaylistRequest): Observable<void> {
    return this.http.post("http://localhost:8080/api/v1/playlists", playlist).pipe(
            map((_) => undefined)
    );
  }

  public addSongsToPlaylist(id: number, songs: Song[]): Observable<void> {
    return this.patchPlaylistSongs(songs, id, PatchOperation.ADD);
  }

  public removeSongsFromPlaylist(id: number, songs: Song[]): Observable<void> {
    return this.patchPlaylistSongs(songs, id, PatchOperation.REMOVE);
  }

  // ------ Helpers ------

  private patchPlaylistSongs(songs: Song[], id: number, patchOperation: PatchOperation) {
    const urls: string[] = songs.map((song: Song) => song.url);
    const body: PlaylistsSongsPatchRequest = {
      op: patchOperation,
      urls: urls
    };
    return this.http.patch<void>(`http://localhost:8080/api/v1/playlists/${id}/songs`, body);
  }

}
