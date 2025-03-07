import {Component, OnInit} from '@angular/core';
import {SubscriptionComponent} from "../../../../shared/components/subscription-component";
import {AudioRepositoryService} from "../../../../core/audio/services/resources/audio-repository.service";
import {BehaviorSubject, tap} from "rxjs";
import {EMPTY_SERVER, Server} from "../../../../core/audio/models/server";

@Component({
  selector: 'app-audio-overlay',
  templateUrl: './audio-overlay.component.html',
  styleUrl: './audio-overlay.component.css'
})
export class AudioOverlayComponent extends SubscriptionComponent implements OnInit {

  public servers$: BehaviorSubject<Server[]> = new BehaviorSubject([EMPTY_SERVER]);

  public constructor(private audioRepositoryService: AudioRepositoryService) {
    super();
  }

  public ngOnInit(): void {
    this.fetchServers();
  }

  // ------ Internal ------

  private fetchServers(): void {
    const fetchedServers = this.audioRepositoryService.findServers()
                             .subscribe((servers: Server[]) => this.servers$.next(servers));
    this.registerSubscription(fetchedServers);
  }

}
