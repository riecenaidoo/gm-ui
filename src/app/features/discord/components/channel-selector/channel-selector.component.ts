import {
  Component,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from "@angular/core";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { Channel } from "../../models/channel";
import { AudioService } from "../../models/audio-service";
import { NgOptimizedImage } from "@angular/common";
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";

/**
 * @remarks
 * - TODO [design] may be worth creating a `ChannelComponent` that is interactable, rather than having this selector.
 *    With the reason being in future when we have NPC chat, we may also be selecting channels and doing other things.
 * - TODO [design] we may still want to consider passing some things as input here, specifically the required channels,
 *    and audio service?
 */
@Component({
  selector: "app-channel-selector",
  templateUrl: "./channel-selector.component.html",
  styleUrl: "./channel-selector.component.css",
  imports: [NgOptimizedImage, LoadingSpinnerComponent],
})
export class ChannelSelectorComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // Internal State
  // ==========================================================================

  /**
   * Track the {@link Channel} being connected to.
   *
   * @see setupConnectingTo
   */
  protected readonly connectingTo: WritableSignal<Channel | undefined> =
    signal(undefined);

  // ==========================================================================
  // External State
  // ==========================================================================

  protected readonly audioService: Signal<AudioService | undefined> =
    this.#bot.audioBot;

  protected readonly channels: Signal<Channel[] | undefined> =
    this.#bot.channels;

  protected readonly isConnecting: Signal<boolean> = this.#bot.isConnecting;

  protected readonly connectedChannel: Signal<Channel | undefined> =
    this.#bot.connectedChannel;

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  public constructor() {
    this.setupConnectingTo();
  }

  /**
   * Clear {@link connectingTo} once a connection has been made.
   */
  private setupConnectingTo() {
    effect(() => {
      if (this.isConnecting()) {
        return;
      }
      this.connectingTo.set(undefined);
    });
  }

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  protected select(channel: Channel | undefined): void {
    this.connectingTo.set(channel);
    this.#bot.connect(channel);
  }
}
