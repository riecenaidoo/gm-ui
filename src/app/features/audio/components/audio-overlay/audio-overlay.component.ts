import {Component, OnInit} from '@angular/core';
import {SubscriptionComponent} from "../../../../shared/components/subscription-component";
import {AudioRepositoryService} from "../../../../core/audio/services/resources/audio-repository.service";
import {BehaviorSubject, Subject} from "rxjs";
import {EMPTY_SERVER, Server} from "../../../../core/audio/models/server";
import {Channel} from "../../../../core/audio/models/channel";

@Component({
  selector: 'app-audio-overlay',
  templateUrl: './audio-overlay.component.html',
  styleUrl: './audio-overlay.component.css'
})
export class AudioOverlayComponent extends SubscriptionComponent implements OnInit {

  public servers$: BehaviorSubject<Server[]> = new BehaviorSubject([EMPTY_SERVER]);

  public channels$: Subject<Channel[]> = new Subject();

  public constructor(private audioRepositoryService: AudioRepositoryService) {
    super();
  }

  public ngOnInit(): void {
    this.fetchServers();
  }

  // ------ Event Handling ------

  public selectServer(server: Server) {
    this.fetchChannels(server)
  }

  // ------ Internal ------

  private fetchServers(): void {
    const fetchedServers = this.audioRepositoryService.findServers()
                             .subscribe((servers: Server[]) => this.servers$.next(servers));
    this.registerSubscription(fetchedServers);
  }

  private fetchChannels(server: Server): void {
    const fetchedChannels = this.audioRepositoryService.getChannels(server)
                                .subscribe((channels: Channel[]) => this.channels$.next(channels));
    this.registerSubscription(fetchedChannels)
  }

}
