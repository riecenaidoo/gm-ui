import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Playlist } from "../../models/playlist";
import { Form } from "../../../../shared/models/form";
import { FormsModule } from "@angular/forms";
import { PlaylistsPatchRequest } from "../../models/requests/playlists-patch-request";

@Component({
  // Intentional `form` attribute-selector.
  // eslint-disable-next-line @angular-eslint/component-selector
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

  @ViewChild("autofocus")
  private autoFocusTarget!: ElementRef<HTMLInputElement>;

  // ------ API ------

  /**
   * The details of the `Playlist` will be used to initialise the form field(s).
   */
  @Input({ required: true })
  public set playlist(playlist: Playlist) {
    this.#playlist = playlist;
    this.title = playlist.title;
  }

  public focus(): void {
    window.requestAnimationFrame(() =>
      this.autoFocusTarget.nativeElement.focus(),
    );
  }

  public submit(): void {
    const patchRequest: PlaylistsPatchRequest = {
      title: this.title,
    };
    this.renamedPlaylist.emit(patchRequest);
  }

  public clearInputs(): void {
    this.title = this.#playlist.title;
  }

  // ------ Internal ------

  protected titleUnchanged(): boolean {
    return this.#playlist.title === this.title;
  }
}
