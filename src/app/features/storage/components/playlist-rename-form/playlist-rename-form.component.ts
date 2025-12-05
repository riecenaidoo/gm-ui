import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from "@angular/core";
import { Playlist } from "../../models/playlist";
import { Form } from "../../../../shared/models/form";
import { FormsModule } from "@angular/forms";
import { PlaylistsPatchRequest } from "../../models/requests/playlists-patch-request";
import { PlaylistApiService } from "../../services/playlist-api.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "form[app-playlist-rename-form]",
  templateUrl: "./playlist-rename-form.component.html",
  styleUrl: "./playlist-rename-form.component.css",
  imports: [FormsModule],
})
export class PlaylistRenameFormComponent implements Form<Playlist> {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #api: PlaylistApiService = inject(PlaylistApiService);

  readonly #destroyed: DestroyRef = inject(DestroyRef);

  // ==========================================================================
  // State
  // ==========================================================================

  public readonly playlist: InputSignal<Playlist> = input.required<Playlist>();

  protected title = "";

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  public constructor() {
    effect(() => (this.title = this.playlist().title));
  }

  // ==========================================================================
  // API
  // ==========================================================================

  /**
   * Title must have changed.
   */
  public isValid(): boolean {
    return this.playlist().title !== this.title;
  }

  public submit(): void {
    if (!this.isValid()) {
      return;
    }

    const patch: PlaylistsPatchRequest = {
      title: this.title,
    };

    this.#api
      .updatePlaylist(this.playlist().id, patch)
      .pipe(takeUntilDestroyed(this.#destroyed))
      .subscribe((playlist: Playlist) => {
        this.submitted.emit(playlist);
        this.reset();
      });
  }

  public submitted: OutputEmitterRef<Playlist> = output<Playlist>();

  public reset(): void {
    this.title = this.playlist().title;
  }
}
