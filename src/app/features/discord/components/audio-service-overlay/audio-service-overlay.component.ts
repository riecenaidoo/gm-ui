import { Component, inject, Signal } from "@angular/core";
import { ServerSelectorComponent } from "../server-selector/server-selector.component";
import { ServerChannelSelectorComponent } from "../server-channel-selector/server-channel-selector.component";
import { ServerAudioStatusComponent } from "../server-audio-status/server-audio-status.component";
import { AudioServiceStatusComponent } from "../audio-service-status/audio-service-status.component";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
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
}
