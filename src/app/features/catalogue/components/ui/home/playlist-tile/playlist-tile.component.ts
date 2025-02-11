import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EMPTY_PLAYLIST, Playlist} from "../../../../../../core/catalogue/models/playlist";

@Component({
  selector: 'app-playlist-tile',
  templateUrl: './playlist-tile.component.html',
  styleUrl: './playlist-tile.component.css'
})
export class PlaylistTileComponent {

  @Input()
  public playlist: Playlist = EMPTY_PLAYLIST;

  @Output()
  private openingPlaylist: EventEmitter<Playlist> = new EventEmitter();

  // ------ Events ------

  protected openingPlaylistEvent(): void {
    this.openingPlaylist.emit(this.playlist);
  }

}
