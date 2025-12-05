import {
  Component,
  DestroyRef,
  effect,
  HostListener,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from "@angular/core";
import { Form } from "../../../../shared/models/form";
import { PlaylistsCreateRequest } from "../../models/requests/playlists-create-request";
import { FormsModule } from "@angular/forms";
import { PlaylistApiService } from "../../services/playlist-api.service";
import { Playlist } from "../../models/playlist";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "form[app-playlist-create-form]",
  templateUrl: "./playlist-create-form.component.html",
  styleUrl: "./playlist-create-form.component.css",
  imports: [FormsModule],
})
export class PlaylistCreateFormComponent implements Form {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #api: PlaylistApiService = inject(PlaylistApiService);

  readonly #destroyed: DestroyRef = inject(DestroyRef);

  // ==========================================================================
  // State
  // ==========================================================================

  protected title = "";

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  public constructor() {
    effect(() => (this.title = this.initialTitle() ?? ""));
  }

  // ==========================================================================
  // API
  // ==========================================================================

  public initialTitle: InputSignal<string | undefined> = input<string>();

  public createdPlaylist: OutputEmitterRef<Playlist> = output<Playlist>();

  /**
   * Must have input.
   */
  public isValid(): boolean {
    return this.title.trim().length !== 0;
  }

  @HostListener("ngSubmit", ["$event"])
  public submit(): void {
    if (!this.isValid()) {
      return;
    }

    const playlist: PlaylistsCreateRequest = {
      title: this.title,
    };

    this.#api
      .createPlaylist(playlist)
      .pipe(takeUntilDestroyed(this.#destroyed))
      .subscribe((playlist: Playlist) => {
        this.createdPlaylist.emit(playlist);
        this.reset();
      });
  }

  public reset(): void {
    this.title = this.initialTitle() ?? "";
  }
}
