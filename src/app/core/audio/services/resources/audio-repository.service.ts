import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Server} from "../../models/server";
import {catchError, Observable, of} from "rxjs";
import {Channel} from "../../models/channel";
import {ServersCreateAudioRequest} from "../../models/requests/servers-create-audio-request";
import {ServerAudio} from "../../models/server-audio";
import {AudioService} from "../../models/audio-service";

@Injectable({
  providedIn: 'root'
})
export class AudioRepositoryService {

  public constructor(private http: HttpClient) {
  }

  // ------ API ------

  public getAudioService(): Observable<AudioService>{
    return this.http.get<AudioService>("http://localhost:5050/");
  }

  public findServers(): Observable<Server[]> {
    return this.http.get<Server[]>("http://localhost:5050/servers");
  }

  public getChannels(server: Server): Observable<Channel[]> {
    return this.http.get<Channel[]>(`http://localhost:5050/servers/${server.id}/channels`);
  }

  /**
   * @returns {Observable<ServerAudio | undefined>} ServerAudio if present, undefined if it has not been connected as yet.
   */
  public getServerAudio(server: Server): Observable<ServerAudio|undefined> {
    return this.http.get<ServerAudio>(`http://localhost:5050/servers/${server.id}/audio`)
               .pipe(catchError((err: any) => {
                         if (err.status === 404) {
                           return of(undefined);
                         } else {
                           throw err;
                         }
                       }
               ));
  }

  public createServerAudio(server: Server, channel: Channel): Observable<void> {
    const request: ServersCreateAudioRequest = {
      channel_id: channel.id
    };
    return this.http.post<void>(`http://localhost:5050/servers/${server.id}/audio`, request);
  }

  public deleteServerAudio(server: Server): Observable<void> {
    return this.http.delete<void>(`http://localhost:5050/servers/${server.id}/audio`);
  }

}
