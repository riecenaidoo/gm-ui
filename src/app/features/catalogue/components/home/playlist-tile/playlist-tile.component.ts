import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Playlist} from "../../../../../core/catalogue/models/playlist";

@Component({
  selector: 'app-playlist-tile',
  templateUrl: './playlist-tile.component.html',
  styleUrl: './playlist-tile.component.css'
})
export class PlaylistTileComponent {

  @Input({required:true})
  public playlist!: Playlist;

  @Output()
  private openingPlaylist: EventEmitter<Playlist> = new EventEmitter();

  // ------ Events ------

  protected openingPlaylistEvent(): void {
    this.openingPlaylist.emit(this.playlist);
  }

}
