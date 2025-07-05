import { Component, OnInit, inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AudioService } from "./core/audio/models/audio-service";
import { SubscriptionComponent } from "./shared/components/subscription-component";
import { AudioApiService } from "./core/audio/services/audio-api.service";
import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import { AudioServiceOverlay } from "./features/audio/overlays/audio-service-overlay/audio-service-overlay.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./core/layout/header/header.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [
    AudioServiceOverlay,
    RouterOutlet,
    HeaderComponent,
    AsyncPipe,
    NgTemplateOutlet,
  ],
})
export class AppComponent extends SubscriptionComponent implements OnInit {
  readonly #service: Subject<AudioService> = new Subject<AudioService>();

  private audioRepositoryService: AudioApiService = inject(AudioApiService);

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
    const fetchedService = this.audioRepositoryService
      .getAudioService()
      .subscribe((service: AudioService) => this.#service.next(service));
    this.registerSubscription(fetchedService);
  }
}
