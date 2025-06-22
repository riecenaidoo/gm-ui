import {Component, OnInit, inject} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {AudioService} from './core/audio/models/audio-service';
import {SubscriptionComponent} from './shared/components/subscription-component';
import {AudioRepositoryService} from './core/audio/services/resources/audio-repository.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { AudioOverlayComponent } from './features/audio/components/audio-overlay/audio-overlay.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [NgIf, AudioOverlayComponent, RouterOutlet, HeaderComponent, AsyncPipe]
})
export class AppComponent extends SubscriptionComponent implements OnInit {

  readonly #service: Subject<AudioService> = new Subject<AudioService>();

  private audioRepositoryService: AudioRepositoryService = inject(AudioRepositoryService);

  public constructor() {
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
