import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Playlist} from "../../models/playlist";
import {HttpClient} from "@angular/common/http";
import {PlaylistsCreateRequest} from "../../models/requests/playlists-create-request";
import {PlaylistsPatchRequest} from '../../models/requests/playlists-patch-request';

@Injectable({
  providedIn: 'root'
})
export class PlaylistRepositoryService {

  public constructor(private http: HttpClient) {
  }

  // ------ API ------

  public findAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>("http://localhost:8080/api/v2/playlists");
  }

  public findById(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`http://localhost:8080/api/v2/playlists/${id}`);
  }

  public createPlaylist(playlist: PlaylistsCreateRequest): Observable<Playlist> {
    return this.http.post<Playlist>("http://localhost:8080/api/v2/playlists", playlist);
  }

  public updatePlaylist(id: number, patch: PlaylistsPatchRequest): Observable<Playlist> {
    if (Object.keys(patch).length === 0) {
      throw new Error("A patch must have at least one key-value pair.");
    }
    return this.http.patch<Playlist>(`http://localhost:8080/api/v2/playlists/${id}`, patch);
  }

  public deletePlaylist(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/v2/playlists/${id}`);
  }

}
