import {
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
  DestroyRef,
} from "@angular/core";
import { AudioApiService } from "../../services/audio-api.service";
import { Observable, Subject } from "rxjs";
import { Server } from "../../models/server";
import { Channel } from "../../models/channel";
import { ServerSelectorComponent } from "../../components/server-selector/server-selector.component";
import { ServerAudio } from "../../models/server-audio";
import { AudioService } from "../../models/audio-service";
import { AsyncPipe } from "@angular/common";
import { ServerChannelSelectorComponent } from "../../components/server-channel-selector/server-channel-selector.component";
import { ServerAudioStatusComponent } from "../../components/server-audio-status/server-audio-status.component";
import { AudioServiceStatusComponent } from "../../components/audio-service-status/audio-service-status.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-audio-service-overlay",
  templateUrl: "./audio-service-overlay.component.html",
  styleUrl: "./audio-service-overlay.component.css",
  imports: [
    ServerSelectorComponent,
    ServerChannelSelectorComponent,
    ServerAudioStatusComponent,
    ServerAudioStatusComponent,
    AsyncPipe,
    AudioServiceStatusComponent,
  ],
})
export class AudioServiceOverlay implements OnInit {
  @Input({ required: true })
  public service!: AudioService;

  readonly #servers: Subject<Server[]> = new Subject<Server[]>();

  readonly #channels: Subject<Channel[]> = new Subject<Channel[]>();

  readonly #serverAudio: Subject<ServerAudio | undefined> = new Subject<
    ServerAudio | undefined
  >();

  @ViewChild("serverSelector")
  private serverSelector?: ServerSelectorComponent;

  private audioRepositoryService: AudioApiService = inject(AudioApiService);

  private destroyed: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.fetchServers();
  }

  // ------ API ------

  public get servers(): Observable<Server[]> {
    return this.#servers;
  }

  public get channels(): Observable<Channel[]> {
    return this.#channels;
  }

  public get serverAudio(): Observable<ServerAudio | undefined> {
    return this.#serverAudio;
  }

  // ------ Event Handling ------

  protected selectServer(server: Server) {
    this.fetchChannels(server);
    this.fetchServerAudio(server);
  }

  /**
   * Until the API is asynchronous, we can't just poll the backend after the action to get the correct state.
   * We don't know whether the action occurred yet.
   */
  protected joinChannel(channel: Channel) {
    const server = this.serverSelector?.selectedServer;
    if (!server) {
      throw new Error(
        "Channel selection depends on Server selection but a Channel was selected before a Server was.",
      );
    }
    this.audioRepositoryService
      .createServerAudio(server, channel)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe(() => this.#serverAudio.next({ channel }));
  }

  /**
   * Until the API is asynchronous, we can't just poll the backend after the action to get the correct state.
   * We don't know whether the action occurred yet.
   */
  protected disconnectAudio(): void {
    const server = this.serverSelector?.selectedServer;
    if (!server) {
      throw new Error(
        "Cannot disconnect ServerAudio if no Server was selected.",
      );
    }
    this.audioRepositoryService
      .deleteServerAudio(server)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((_) => this.#serverAudio.next(undefined));
  }

  // ------ Internal ------

  private fetchServers(): void {
    this.audioRepositoryService
      .findServers()
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((servers: Server[]) => this.#servers.next(servers));
  }

  private fetchChannels(server: Server): void {
    this.audioRepositoryService
      .getChannels(server)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((channels: Channel[]) => this.#channels.next(channels));
  }

  /**
   * At some stage in the future this information needs to come down from the API via a websocket.
   */
  private fetchServerAudio(server: Server): void {
    this.audioRepositoryService
      .getServerAudio(server)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((serverAudio?: ServerAudio) =>
        this.#serverAudio.next(serverAudio),
      );
  }
}
