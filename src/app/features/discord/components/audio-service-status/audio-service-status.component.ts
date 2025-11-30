import { Component, inject, Signal } from "@angular/core";
import { AudioService } from "../../models/audio-service";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-audio-service-status",
  templateUrl: "./audio-service-status.component.html",
  styleUrl: "./audio-service-status.component.css",
  imports: [NgOptimizedImage],
})
export class AudioServiceStatusComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // State
  // ==========================================================================

  public audioService: Signal<AudioService | undefined> = this.#bot.audioBot;
}
