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
import { ChannelAudioComponent } from "../channel-audio/channel-audio.component";

@Component({
  selector: "app-channel-selector",
  templateUrl: "./channel-selector.component.html",
  styleUrl: "./channel-selector.component.css",
  imports: [ChannelAudioComponent],
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
