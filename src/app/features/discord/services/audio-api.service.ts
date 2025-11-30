import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Server } from "../models/server";
import { catchError, Observable, of } from "rxjs";
import { Channel } from "../models/channel";
import { ServerAudioCreateRequest } from "../models/requests/server-audio-create-request";
import { ServerAudio } from "../models/server-audio";
import { AudioService } from "../models/audio-service";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AudioApiService {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #http: HttpClient = inject(HttpClient);

  // ==========================================================================
  // API
  // ==========================================================================

  /**
   * @return {@link AudioService} if it is available, or `undefined` if there was a failure to connect.
   */
  public getAudioService(): Observable<AudioService | undefined> {
    return this.#http
      .get<AudioService | undefined>(`${this.#audioEndpoint}/`)
      .pipe(catchError((_: HttpErrorResponse) => of(undefined)));
  }

  public getServers(): Observable<Server[]> {
    return this.#http.get<Server[]>(`${this.#audioEndpoint}/servers`);
  }

  public getChannels(server: Server): Observable<Channel[]> {
    return this.#http.get<Channel[]>(
      `${this.#audioEndpoint}/servers/${server.id}/channels`,
    );
  }

  public createServerAudio(server: Server, channel: Channel): Observable<void> {
    const request: ServerAudioCreateRequest = {
      channel_id: channel.id,
    };
    return this.#http.post<void>(
      `${this.#audioEndpoint}/servers/${server.id}/audio`,
      request,
    );
  }

  /**
   * @returns {Observable<ServerAudio | undefined>} ServerAudio if present, undefined if it has not been connected as yet.
   */
  public getServerAudio(server: Server): Observable<ServerAudio | undefined> {
    return this.#http
      .get<ServerAudio>(`${this.#audioEndpoint}/servers/${server.id}/audio`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            return of(undefined);
          } else {
            throw err;
          }
        }),
      );
  }

  public deleteServerAudio(server: Server): Observable<void> {
    return this.#http.delete<void>(
      `${this.#audioEndpoint}/servers/${server.id}/audio`,
    );
  }

  // ==========================================================================
  // Implementation Details
  // ==========================================================================

  readonly #audioEndpoint = `${environment.apiDiscord}`;
}
