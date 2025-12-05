import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PlaylistSong } from "../models/playlist-song";
import { PlaylistSongsCreateRequest } from "../models/requests/playlist-songs-create-request";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PlaylistSongsApiService {
  readonly playlistsEndpoint = `${environment.apiStorage}/playlists`;

  private http: HttpClient = inject(HttpClient);

  // ------ API ------

  public createPlaylistSong(
    id: number,
    request: PlaylistSongsCreateRequest,
  ): Observable<PlaylistSong> {
    return this.http.post<PlaylistSong>(
      `${this.playlistsEndpoint}/${id}/songs`,
      request,
    );
  }

  public getPlaylistSongs(id: number): Observable<PlaylistSong[]> {
    return this.http.get<PlaylistSong[]>(
      `${this.playlistsEndpoint}/${id}/songs`,
    );
  }

  public deletePlaylistSong(id: number, song: PlaylistSong): Observable<void> {
    return this.http.delete<void>(
      `${this.playlistsEndpoint}/${id}/songs/${song.id}`,
    );
  }
}
