import { Component, inject, DestroyRef } from "@angular/core";
import { BehaviorSubject, filter, Observable } from "rxjs";
import { AudioService } from "./features/audio/models/audio-service";
import { AudioApiService } from "./features/audio/services/audio-api.service";
import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import { AudioServiceOverlay } from "./features/audio/overlays/audio-service-overlay/audio-service-overlay.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AudioOverlayToggleComponent } from "./features/audio/components/audio-overlay-toggle/audio-overlay-toggle.component";

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
    AudioOverlayToggleComponent,
  ],
})
export class AppComponent {
  readonly #service: BehaviorSubject<AudioService | null> =
    new BehaviorSubject<AudioService | null>(null);

  private audioRepositoryService: AudioApiService = inject(AudioApiService);

  private destroyed: DestroyRef = inject(DestroyRef);

  // ------ Component ------

  protected get service(): Observable<AudioService> {
    return this.#service.pipe(filter((service) => !!service));
  }

  // ------ Event Handling ------

  protected toggleAudioService(): void {
    if (this.#service.value == null) {
      this.fetchService();
    } else {
      this.#service.next(null);
    }
  }

  // ------ Internal ------

  private fetchService(): void {
    this.audioRepositoryService
      .getAudioService()
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((service: AudioService) => this.#service.next(service));
  }
}
