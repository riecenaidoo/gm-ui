import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {Playlist} from "../../models/playlist";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PlaylistRepositoryService {

  public constructor(private http: HttpClient) {
  }

  // ------ API ------

  public findAll(): Observable<Playlist[]> {
    return this.http.get("http://localhost:8080/api/v1/playlists").pipe(
            map((responseBody) => Object.assign([], responseBody)),
            map((dataArray: Object[]) => dataArray.map(this.toPlaylist.bind(this)))
    );
  }

  // ------ Helper ------

  /**
   *  TODO Decide whether this should sit in the `playlist.ts` file, or remain here.
   */
  private toPlaylist(data: any): Playlist {
    return {
      id: data.id,
      name: data.name,
      songs: data.songs
    };
  }

}
