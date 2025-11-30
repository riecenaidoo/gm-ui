import { Component, inject, Signal } from "@angular/core";
import { ServerAudio } from "../../models/server-audio";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";

@Component({
  selector: "app-audio-status",
  templateUrl: "./audio-status.component.html",
  styleUrl: "./audio-status.component.css",
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

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  protected disconnect(): void {
    this.#bot.connect(undefined);
  }
}
