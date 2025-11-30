import { Component, computed, inject, Signal } from "@angular/core";
import { AudioService } from "./features/discord/models/audio-service";
import { AudioServiceOverlay } from "./features/discord/components/audio-service-overlay/audio-service-overlay.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";
import { AudioOverlayToggleComponent } from "./features/discord/components/audio-overlay-toggle/audio-overlay-toggle.component";
import { PageService } from "./features/catalogue/services/page.service";
import { DrawerComponent } from "./shared/components/drawer/drawer.component";
import {
  AudioBot,
  AudioStateService,
} from "./features/discord/services/audio-state.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [
    AudioServiceOverlay,
    RouterOutlet,
    HeaderComponent,
    AudioOverlayToggleComponent,
    DrawerComponent,
  ],
})
export class AppComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  readonly #pageService: PageService = inject(PageService);

  // ==========================================================================
  // State
  // ==========================================================================

  protected readonly service: Signal<AudioService | undefined> =
    this.#bot.audioBot;

  protected readonly pageTitle: Signal<string> = computed(() => {
    return this.#pageService.currentPage()?.title ?? "Gamemaster Dashboard";
  });
}
