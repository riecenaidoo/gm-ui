import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Server} from "../../models/server";
import {Observable} from "rxjs";
import {Channel} from "../../models/channel";
import {ServersCreateAudioRequest} from "../../models/requests/servers-create-audio-request";

@Injectable({
  providedIn: 'root'
})
export class AudioRepositoryService {

  public constructor(private http: HttpClient) {
  }

  // ------ API ------

  public findServers(): Observable<Server[]> {
    return this.http.get<Server[]>("http://localhost:5050/servers");
  }

  public getChannels(server: Server): Observable<Channel[]> {
    return this.http.get<Channel[]>(`http://localhost:5050/servers/${server.id}/channels`);
  }

  public createServerAudio(server: Server, channel: Channel): Observable<void> {
    const request: ServersCreateAudioRequest = {
      channel_id: channel.id
    };
    return this.http.post<void>(`http://localhost:5050/servers/${server.id}/audio`, request);
  }

}
