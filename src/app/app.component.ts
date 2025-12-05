import { Component, computed, inject, Signal } from "@angular/core";
import { AudioService } from "./features/discord/models/audio-service";
import { DiscordControlPanelComponent } from "./features/discord/components/discord-control-panel/discord-control-panel.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";
import { DiscordStatusComponent } from "./features/discord/components/discord-status/discord-status.component";
import { PageService } from "./features/storage/services/page.service";
import { DrawerComponent } from "./shared/components/drawer/drawer.component";
import {
  AudioBot,
  AudioStateService,
} from "./features/discord/services/audio-state.service";
import { HotkeyDirective } from "./shared/directives/hotkey.directive";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [
    DiscordControlPanelComponent,
    RouterOutlet,
    HeaderComponent,
    DiscordStatusComponent,
    DrawerComponent,
    HotkeyDirective,
  ],
})
export class AppComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #bot: AudioBot = inject(AudioStateService);

  readonly #pageService: PageService = inject(PageService);

  // ==========================================================================
  // State
  // ==========================================================================

  protected readonly service: Signal<AudioService | undefined> =
    this.#bot.audioBot;

  protected readonly pageTitle: Signal<string> = computed(() => {
    return this.#pageService.currentPage()?.title ?? "Gamemaster Dashboard";
  });
}
