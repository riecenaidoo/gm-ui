import { Component, inject, Signal } from "@angular/core";
import { Server } from "../../models/server";
import { FormsModule } from "@angular/forms";
import {
  AudioBot,
  AudioStateService,
} from "../../services/audio-state.service";
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";
import { debounced } from "../../../../shared/utils/debounced/debounced";

@Component({
  selector: "app-server-selector",
  templateUrl: "./server-selector.component.html",
  styleUrl: "./server-selector.component.css",
  imports: [FormsModule, LoadingSpinnerComponent],
})
export class ServerSelectorComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  // ==========================================================================
  // Derived State
  // ==========================================================================

  protected readonly loadingServers: Signal<boolean> = debounced(
    this.#bot.isLoading.servers,
  );

  protected readonly servers: Signal<Server[] | undefined> = this.#bot.servers;

  protected readonly selectedServer: Signal<Server | undefined> =
    this.#bot.selectedServer;

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  protected select(server: Server | undefined) {
    this.#bot.selectServer(server);
  }
}
