import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Playlist } from "../../models/playlist";
import { Form } from "../../../../shared/models/form";
import { FormsModule } from "@angular/forms";
import { PlaylistsPatchRequest } from "../../models/requests/playlists-patch-request";

@Component({
  selector: "form[app-playlist-rename-form]",
  templateUrl: "./playlist-rename-form.component.html",
  styleUrl: "./playlist-rename-form.component.css",
  imports: [FormsModule],
})
export class PlaylistRenameFormComponent implements Form {
  #playlist!: Playlist;

  public title!: string;

  @Output()
  private renamedPlaylist: EventEmitter<PlaylistsPatchRequest> =
    new EventEmitter<PlaylistsPatchRequest>();

  // ==========================================================================
  // API
  // ==========================================================================

  /**
   * The details of the `Playlist` will be used to initialise the form field(s).
   */
  @Input({ required: true })
  public set playlist(playlist: Playlist) {
    this.#playlist = playlist;
    this.title = playlist.title;
  }

  public submit(): void {
    if (!this.isValid()) {
      return;
    }

    const patchRequest: PlaylistsPatchRequest = {
      title: this.title,
    };
    this.renamedPlaylist.emit(patchRequest);
  }

  public reset(): void {
    this.title = this.#playlist.title;
  }

  // ==========================================================================
  // Implementation Details
  // ==========================================================================

  /**
   * Title must have changed.
   */
  public isValid(): boolean {
    return this.#playlist.title !== this.title;
  }
}
