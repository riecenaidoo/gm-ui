import { Component, Input, output } from "@angular/core";
import { PlaylistSong } from "../../models/playlist-song";
import { NgOptimizedImage } from "@angular/common";

@Component({
  // Intentional `table` attribute-selector.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "table[app-song-table]",
  templateUrl: "./song-table.component.html",
  styleUrl: "./song-table.component.css",
  imports: [NgOptimizedImage],
})
export class SongTableComponent {
  @Input({ required: true })
  public songs!: PlaylistSong[];

  public readonly removingSong = output<PlaylistSong>();

  public readonly copyingSongToClipboard = output<PlaylistSong>();

  // ------ Events ------

  protected removingSongEvent(song: PlaylistSong): void {
    this.removingSong.emit(song);
  }

  protected copyingSongToClipboardEvent(song: PlaylistSong): void {
    this.copyingSongToClipboard.emit(song);
  }
}
