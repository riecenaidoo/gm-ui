import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AudioService} from './core/audio/models/audio-service';
import {SubscriptionComponent} from './shared/components/subscription-component';
import {AudioRepositoryService} from './core/audio/services/resources/audio-repository.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent extends SubscriptionComponent implements OnInit {

  readonly #service: Subject<AudioService> = new Subject();

  public constructor(private audioRepositoryService: AudioRepositoryService) {
    super();
  }

  public ngOnInit(): void {
    this.fetchService();
  }

  // ------ API ------

  public get service(): Observable<AudioService> {
    return this.#service;
  }

  // ------ Internal ------

  private fetchService(): void {
    const fetchedService = this.audioRepositoryService.getAudioService()
                               .subscribe((service: AudioService) => this.#service.next(service));
    this.registerSubscription(fetchedService);
  }

}
