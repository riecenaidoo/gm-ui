import { Component, computed, inject, Signal } from "@angular/core";
import { AudioService } from "../../models/audio-service";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { NgOptimizedImage } from "@angular/common";
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: "app-bot-status",
  templateUrl: "./bot-status.component.html",
  styleUrl: "./bot-status.component.css",
  imports: [NgOptimizedImage, LoadingSpinnerComponent],
})
export class BotStatusComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // Derived State
  // ==========================================================================

  protected bot: Signal<AudioService | undefined> = this.#bot.audioBot;

  protected loading: Signal<boolean> = computed(() => this.bot() === undefined);
}
