import { Component, EventEmitter, Input, Output } from "@angular/core";
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

  @Output()
  private removingSong: EventEmitter<PlaylistSong> =
    new EventEmitter<PlaylistSong>();

  // ------ Events ------

  protected removingSongEvent(song: PlaylistSong): void {
    this.removingSong.emit(song);
  }
}
