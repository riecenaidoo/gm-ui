import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { Form } from "../../../../shared/models/form";
import { PlaylistSongsCreateRequest } from "../../models/requests/playlist-songs-create-request";
import { FormsModule } from "@angular/forms";

@Component({
  // Intentional `form` attribute-selector.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "form[app-song-create-form]",
  templateUrl: "./song-create-form.component.html",
  styleUrl: "./song-create-form.component.css",
  imports: [FormsModule],
})
export class SongCreateFormComponent implements Form {
  public url = "";

  @Output()
  private addedSong: EventEmitter<PlaylistSongsCreateRequest> =
    new EventEmitter<PlaylistSongsCreateRequest>();

  @ViewChild("autofocus")
  private autoFocusTarget!: ElementRef<HTMLInputElement>;

  // ==========================================================================
  // API
  // ==========================================================================

  public focus(): void {
    window.requestAnimationFrame(() =>
      this.autoFocusTarget.nativeElement.focus(),
    );
  }

  public submit(): void {
    if (!this.isValid()) {
      return;
    }

    const song: PlaylistSongsCreateRequest = { url: this.url };
    this.addedSong.emit(song);
  }

  public reset(): void {
    this.url = "";
  }

  // ==========================================================================
  // Implementation Details
  // ==========================================================================

  /**
   * Must have input.
   */
  public isValid(): boolean {
    return this.url.trim().length !== 0;
  }
}
