import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-new-playlist-tile',
  templateUrl: './new-playlist-tile.component.html',
  styleUrl: './new-playlist-tile.component.css'
})
export class NewPlaylistTileComponent {

  @Output()
  private creatingPlaylist: EventEmitter<void> = new EventEmitter();

  // ------ Events ------

  protected creatingPlaylistEvent(): void {
    this.creatingPlaylist.emit();
  }

}
