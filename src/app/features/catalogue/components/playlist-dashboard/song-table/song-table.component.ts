import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PlaylistSong } from "../../../../../core/catalogue/models/playlist-song";

@Component({
  selector: "app-song-table",
  templateUrl: "./song-table.component.html",
  styleUrl: "./song-table.component.css",
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
