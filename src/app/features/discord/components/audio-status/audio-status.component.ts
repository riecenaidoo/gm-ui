import { Component, inject, Signal } from "@angular/core";
import { ServerAudio } from "../../models/server-audio";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";
import { debounced } from "../../../../shared/utils/debounced/debounced";

@Component({
  selector: "app-audio-status",
  templateUrl: "./audio-status.component.html",
  styleUrl: "./audio-status.component.css",
  imports: [LoadingSpinnerComponent],
})
export class AudioStatusComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // External State
  // ==========================================================================

  protected readonly serverAudio: Signal<ServerAudio | undefined> =
    this.#bot.serverAudio;

  protected readonly isConnecting: Signal<boolean> = debounced(
    this.#bot.isConnecting,
  );

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  protected disconnect(): void {
    this.#bot.connect(undefined);
  }
}
