import { Component, inject, Signal } from "@angular/core";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { AudioService } from "../../models/audio-service";
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";
import { NgOptimizedImage } from "@angular/common";
import { debounced } from "../../../../shared/utils/debounced/debounced";

@Component({
  selector: "app-channel-audio",
  imports: [LoadingSpinnerComponent, NgOptimizedImage],
  templateUrl: "./channel-audio.component.html",
  styleUrl: "./channel-audio.component.css",
})
export class ChannelAudioComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // Derived State
  // ==========================================================================

  protected readonly audioService: Signal<AudioService | undefined> =
    this.#bot.audioBot;

  protected readonly isConnecting: Signal<boolean> = debounced(
    this.#bot.isConnecting,
  );
}
