import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PlaylistSong} from '../models/playlist-song';
import {PlaylistSongsCreateRequest} from '../models/requests/playlist-songs-create-request';

@Injectable({
  providedIn: 'root'
})
export class PlaylistSongsService {

  private http: HttpClient = inject(HttpClient);

  // ------ API ------

  public createPlaylistSong(id: number, request: PlaylistSongsCreateRequest): Observable<PlaylistSong> {
    return this.http.post<PlaylistSong>(`http://localhost:8080/api/v2/playlists/${id}/songs`, request);
  }

  public getPlaylistSongs(id: number): Observable<PlaylistSong[]> {
    return this.http.get<PlaylistSong[]>(`http://localhost:8080/api/v2/playlists/${id}/songs`);
  }

  public deletePlaylistSong(id: number, song: PlaylistSong): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/v2/playlists/${id}/songs/${song.id}`);
  }

}
