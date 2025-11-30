import { Component, inject, Signal } from "@angular/core";
import { ServerSelectorComponent } from "../server-selector/server-selector.component";
import { ChannelSelectorComponent } from "../channel-selector/channel-selector.component";
import { AudioStatusComponent } from "../audio-status/audio-status.component";
import { BotStatusComponent } from "../bot-status/bot-status.component";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { AudioService } from "../../models/audio-service";

@Component({
  selector: "app-discord-control-panel",
  templateUrl: "./discord-control-panel.component.html",
  styleUrl: "./discord-control-panel.component.css",
  imports: [
    ServerSelectorComponent,
    ChannelSelectorComponent,
    AudioStatusComponent,
    AudioStatusComponent,
    BotStatusComponent,
  ],
})
export class DiscordControlPanelComponent {
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
