import {Component, OnInit, ViewChild} from '@angular/core';
import {SubscriptionComponent} from "../../../../shared/components/subscription-component";
import {AudioRepositoryService} from "../../../../core/audio/services/resources/audio-repository.service";
import {Observable, Subject} from "rxjs";
import {Server} from "../../../../core/audio/models/server";
import {Channel} from "../../../../core/audio/models/channel";
import {ServerSelectorComponent} from "./server-selector/server-selector.component";

@Component({
  selector: 'app-audio-overlay',
  templateUrl: './audio-overlay.component.html',
  styleUrl: './audio-overlay.component.css'
})
export class AudioOverlayComponent extends SubscriptionComponent implements OnInit {

  readonly #servers$: Subject<Server[]> = new Subject();

  readonly #channels$: Subject<Channel[]> = new Subject();

  @ViewChild("serverSelector")
  private serverSelector?: ServerSelectorComponent;

  public constructor(private audioRepositoryService: AudioRepositoryService) {
    super();
  }

  public ngOnInit(): void {
    this.fetchServers();
  }

  // ------ API ------

  public get servers$(): Observable<Server[]> {
    return this.#servers$;
  }

  public get channels$(): Observable<Channel[]> {
    return this.#channels$;
  }

  // ------ Event Handling ------

  protected selectServer(server: Server) {
    this.fetchChannels(server)
  }

  protected joinChannel(channel: Channel) {
    const server = this.serverSelector?.selectedServer;
    if (!server) {
      throw new Error(
              "Channel selection depends on Server selection but a Channel was selected before a Server was."
      );
    }
    const joinedChannel = this.audioRepositoryService.createServerAudio(server, channel)
                              .subscribe();
    this.registerSubscription(joinedChannel)
  }

  // ------ Internal ------

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

}
