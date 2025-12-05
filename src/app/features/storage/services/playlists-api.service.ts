import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Playlist } from "../models/playlist";
import { HttpClient } from "@angular/common/http";
import { PlaylistsCreateRequest } from "../models/requests/playlists-create-request";
import { PlaylistsPatchRequest } from "../models/requests/playlists-patch-request";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PlaylistsApiService {
  readonly playlistsEndpoint = `${environment.apiStorage}/playlists`;

  private http: HttpClient = inject(HttpClient);

  // ------ API ------

  public findAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.playlistsEndpoint}`);
  }

  public findById(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.playlistsEndpoint}/${id}`);
  }

  /**
   * @param {string} title a non-blank, case-insensitive text fragment (`string`) that a {@link Playlist#title} must
   * match against.
   */
  public findByTitle(title: string): Observable<Playlist[]> {
    if (title.trim().length === 0) {
      throw new Error("Title must be non-blank.");
    }
    return this.http.get<Playlist[]>(
      `${this.playlistsEndpoint}?title=${title}`,
    );
  }

  public createPlaylist(
    playlist: PlaylistsCreateRequest,
  ): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.playlistsEndpoint}`, playlist);
  }

  public updatePlaylist(
    id: number,
    patch: PlaylistsPatchRequest,
  ): Observable<Playlist> {
    if (Object.keys(patch).length === 0) {
      throw new Error("A patch must have at least one key-value pair.");
    }
    return this.http.patch<Playlist>(`${this.playlistsEndpoint}/${id}`, patch);
  }

  public deletePlaylist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.playlistsEndpoint}/${id}`);
  }
}
