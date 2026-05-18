import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from "@angular/core";
import { PlaylistSong } from "../../models/playlist-song";
import { NgOptimizedImage, NgTemplateOutlet } from "@angular/common";
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: "table[app-song-table]",
  templateUrl: "./song-table.component.html",
  styleUrl: "./song-table.component.css",
  imports: [NgOptimizedImage, LoadingSpinnerComponent, NgTemplateOutlet],
})
export class SongTableComponent {
  // ==========================================================================
  // API
  // ==========================================================================

  public readonly songs: InputSignal<PlaylistSong[]> =
    input.required<PlaylistSong[]>();

  public readonly removingSong: OutputEmitterRef<PlaylistSong> =
    output<PlaylistSong>();

  public readonly loading: InputSignal<boolean> = input<boolean>(false);

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  /**
   * @remarks Copying to clipboard might be a global utility, but for now it is localised to this page.
   * TODO When we introduce toasts, these logs should be replaced with toast messages instead.
   */
  protected copySongToClipboard(song: PlaylistSong): void {
    navigator.clipboard
      .writeText(song.url)
      .then(() => console.info(`Copied ${song.url} to clipboard.`))
      .catch((err) =>
        console.error(`Failed to copy ${song.url} to clipboard. Cause: ${err}`),
      );
  }

  protected removeSong(song: PlaylistSong): void {
    this.removingSong.emit(song);
  }
}
