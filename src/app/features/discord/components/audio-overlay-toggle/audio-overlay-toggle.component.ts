import {
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";

@Component({
  selector: "app-audio-overlay-toggle",
  imports: [NgOptimizedImage],
  templateUrl: "./audio-overlay-toggle.component.html",
  styleUrl: "./audio-overlay-toggle.component.css",
})
export class AudioOverlayToggleComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // State
  // ==========================================================================

  protected readonly connected: Signal<boolean> = computed(
    () => this.#bot.audioBot() !== undefined,
  );

  protected readonly reconnecting: WritableSignal<boolean> = signal(false);

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  /**
   * @remarks When we trigger a {@link AudioBot#reconnect} we set out loading state ({@link reconnecting}). This must be
   * synced with the {@link AudioBot} state, so when an update occurs we clear our loading state.
   */
  public constructor() {
    effect(() => {
      this.#bot.audioBot();
      this.reconnecting.set(false);
    });
  }

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  protected reconnect(): void {
    this.#bot.reconnect();
    this.reconnecting.set(true);
  }
}
