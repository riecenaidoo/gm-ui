import {Component, OnInit, ViewChild} from '@angular/core';
import {SubscriptionComponent} from "../../../../shared/components/subscription-component";
import {AudioRepositoryService} from "../../../../core/audio/services/resources/audio-repository.service";
import {Observable, Subject} from "rxjs";
import {Server} from "../../../../core/audio/models/server";
import {Channel} from "../../../../core/audio/models/channel";
import {ServerSelectorComponent} from "./server-selector/server-selector.component";
import {ServerAudio} from "../../../../core/audio/models/server-audio";
import {AudioService} from "../../../../core/audio/models/audio-service";

@Component({
  selector: 'app-audio-overlay',
  templateUrl: './audio-overlay.component.html',
  styleUrl: './audio-overlay.component.css'
})
export class AudioOverlayComponent extends SubscriptionComponent implements OnInit {

  readonly #service$: Subject<AudioService> = new Subject();

  readonly #servers$: Subject<Server[]> = new Subject();

  readonly #channels$: Subject<Channel[]> = new Subject();

  readonly #serverAudio: Subject<ServerAudio|undefined> = new Subject();

  @ViewChild("serverSelector")
  private serverSelector?: ServerSelectorComponent;

  public constructor(private audioRepositoryService: AudioRepositoryService) {
    super();
  }

  public ngOnInit(): void {
    this.fetchService();
    this.fetchServers();
  }

  // ------ API ------

  public get service$(): Observable<AudioService> {
    return this.#service$;
  }

  public get servers$(): Observable<Server[]> {
    return this.#servers$;
  }

  public get channels$(): Observable<Channel[]> {
    return this.#channels$;
  }

  public get serverAudio$(): Observable<ServerAudio|undefined> {
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
              "Channel selection depends on Server selection but a Channel was selected before a Server was."
      );
    }
    const joinedChannel = this.audioRepositoryService.createServerAudio(server, channel)
                              .subscribe((_) => this.#serverAudio.next({channel}));
    this.registerSubscription(joinedChannel)
  }

  /**
   * Until the API is asynchronous, we can't just poll the backend after the action to get the correct state.
   * We don't know whether the action occurred yet.
   */
  protected disconnectAudio(): void {
    const server = this.serverSelector?.selectedServer;
    if (!server) {
      throw new Error(
              "Cannot disconnect ServerAudio if no Server was selected."
      );
    }
    const disconnectedAudio = this.audioRepositoryService.deleteServerAudio(server)
                                  .subscribe((_) => this.#serverAudio.next(undefined));
    this.registerSubscription(disconnectedAudio);
  }

  // ------ Internal ------

  private fetchService(): void {
    const fetchedService = this.audioRepositoryService.getAudioService()
                               .subscribe((service: AudioService) => this.#service$.next(service));
    this.registerSubscription(fetchedService);
  }

  private fetchServers(): void {
    const fetchedServers = this.audioRepositoryService.findServers()
                               .subscribe((servers: Server[]) => this.#servers$.next(servers));
    this.registerSubscription(fetchedServers);
  }

  private fetchChannels(server: Server): void {
    const fetchedChannels = this.audioRepositoryService.getChannels(server)
                                .subscribe((channels: Channel[]) => this.#channels$.next(channels));
    this.registerSubscription(fetchedChannels)
  }

  /**
   * At some stage in the future this information needs to come down from the API via a websocket.
   */
  private fetchServerAudio(server: Server): void {
    const fetchedServerAudio = this.audioRepositoryService.getServerAudio(server)
                                   .subscribe((serverAudio?: ServerAudio) => this.#serverAudio.next(serverAudio));
    this.registerSubscription(fetchedServerAudio);
  }

}
