import { Component, OnInit, inject, DestroyRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AudioService } from "./features/audio/models/audio-service";
import { AudioApiService } from "./features/audio/services/audio-api.service";
import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import { AudioServiceOverlay } from "./features/audio/overlays/audio-service-overlay/audio-service-overlay.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
export class AppComponent implements OnInit {
  readonly #service: Subject<AudioService> = new Subject<AudioService>();

  private audioRepositoryService: AudioApiService = inject(AudioApiService);

  private destroyed: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.fetchService();
  }

  // ------ API ------

  public get service(): Observable<AudioService> {
    return this.#service;
  }

  // ------ Internal ------

  private fetchService(): void {
    this.audioRepositoryService
      .getAudioService()
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((service: AudioService) => this.#service.next(service));
  }
}
