import { Component, inject, Signal } from "@angular/core";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { Channel } from "../../models/channel";
import { AudioService } from "../../models/audio-service";
import { NgOptimizedImage } from "@angular/common";

/**
 * @remarks
 * - TODO [design] may be worth creating a `ChannelComponent` that is interactable, rather than having this selector.
 *    With the reason being in future when we have NPC chat, we may also be selecting channels and doing other things.
 * - TODO [design] we may still want to consider passing some things as input here, specifically the required channels,
 *    and audio service?
 */
@Component({
  selector: "app-server-channel-selector",
  templateUrl: "./server-channel-selector.component.html",
  styleUrl: "./server-channel-selector.component.css",
  imports: [NgOptimizedImage],
})
export class ServerChannelSelectorComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // State
  // ==========================================================================

  protected readonly audioService: Signal<AudioService | undefined> =
    this.#bot.audioBot;

  protected readonly channels: Signal<Channel[] | undefined> =
    this.#bot.channels;

  protected readonly connectedChannel: Signal<Channel | undefined> =
    this.#bot.connectedChannel;

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  protected select(channel: Channel | undefined): void {
    this.#bot.connect(channel);
  }
}
