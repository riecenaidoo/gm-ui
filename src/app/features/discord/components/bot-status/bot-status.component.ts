import { Component, inject, Signal } from "@angular/core";
import { AudioService } from "../../models/audio-service";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-bot-status",
  templateUrl: "./bot-status.component.html",
  styleUrl: "./bot-status.component.css",
  imports: [NgOptimizedImage],
})
export class BotStatusComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // State
  // ==========================================================================

  public audioService: Signal<AudioService | undefined> = this.#bot.audioBot;
}
