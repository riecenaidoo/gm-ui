import { Component, inject, Signal } from "@angular/core";
import { ServerSelectorComponent } from "../../components/server-selector/server-selector.component";
import { ServerChannelSelectorComponent } from "../../components/server-channel-selector/server-channel-selector.component";
import { ServerAudioStatusComponent } from "../../components/server-audio-status/server-audio-status.component";
import { AudioServiceStatusComponent } from "../../components/audio-service-status/audio-service-status.component";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { ServerAudio } from "../../models/server-audio";
import { AudioService } from "../../models/audio-service";

@Component({
  selector: "app-audio-service-overlay",
  templateUrl: "./audio-service-overlay.component.html",
  styleUrl: "./audio-service-overlay.component.css",
  imports: [
    ServerSelectorComponent,
    ServerChannelSelectorComponent,
    ServerAudioStatusComponent,
    ServerAudioStatusComponent,
    AudioServiceStatusComponent,
  ],
})
export class AudioServiceOverlay {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // External State
  // ==========================================================================

  protected readonly service: Signal<AudioService | undefined> =
    this.#bot.audioBot;

  protected readonly serverAudio: Signal<ServerAudio | undefined> =
    this.#bot.serverAudio;

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  protected disconnectAudio(): void {
    this.#bot.connect(undefined);
  }
}
