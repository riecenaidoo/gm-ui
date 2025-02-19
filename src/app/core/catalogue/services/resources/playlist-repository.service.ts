import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Playlist} from "../../models/playlist";
import {HttpClient} from "@angular/common/http";
import {PlaylistsCreateRequest} from "../../models/requests/playlists-create-request";
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
   * @param {PlaylistsCreateRequest} playlist
   * @returns {Observable<void>}
   */
  public createPlaylist(playlist: PlaylistsCreateRequest): Observable<void> {
    return this.http.post<void>("http://localhost:8080/api/v1/playlists", playlist);
  }

  public addSongsToPlaylist(id: number, songs: Song[]): Observable<void> {
    return this.patchPlaylistSongs(songs, id, PatchOperation.ADD);
  }

  public removeSongsFromPlaylist(id: number, songs: Song[]): Observable<void> {
    return this.patchPlaylistSongs(songs, id, PatchOperation.REMOVE);
  }

  public renamePlaylist(id: number, name: string): Observable<void>{
    return this.http.put<void>(`http://localhost:8080/api/v1/playlists/${id}/name`, {name})
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
