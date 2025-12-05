import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from "@angular/core";
import { Form } from "../../../../shared/models/form";
import { PlaylistSongsCreateRequest } from "../../models/requests/playlist-songs-create-request";
import { FormsModule } from "@angular/forms";
import { PlaylistApiService } from "../../services/playlist-api.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Playlist } from "../../models/playlist";
import { PlaylistSong } from "../../models/playlist-song";

@Component({
  selector: "form[app-song-create-form]",
  templateUrl: "./song-create-form.component.html",
  styleUrl: "./song-create-form.component.css",
  imports: [FormsModule],
})
export class SongCreateFormComponent implements Form<PlaylistSong> {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #api: PlaylistApiService = inject(PlaylistApiService);

  readonly #destroyed: DestroyRef = inject(DestroyRef);

  // ==========================================================================
  // State
  // ==========================================================================

  public readonly playlist: InputSignal<Playlist> = input.required<Playlist>();

  public url = "";

  // ==========================================================================
  // API
  // ==========================================================================

  /**
   * Must have input.
   */
  public isValid(): boolean {
    return this.url.trim().length !== 0;
  }

  @HostListener("ngSubmit", ["$event"])
  public submit(): void {
    if (!this.isValid()) {
      return;
    }

    const song: PlaylistSongsCreateRequest = { url: this.url };

    this.#api
      .createPlaylistSong(this.playlist().id, song)
      .pipe(takeUntilDestroyed(this.#destroyed))
      .subscribe((song: PlaylistSong) => {
        this.submitted.emit(song);
        this.reset();
      });
  }

  public submitted: OutputEmitterRef<PlaylistSong> = output<PlaylistSong>();

  public reset(): void {
    this.url = "";
  }
}
