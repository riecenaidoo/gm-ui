import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-new-playlist-tile',
  templateUrl: './new-playlist-tile.component.html',
  styleUrl: './new-playlist-tile.component.css'
})
export class NewPlaylistTileComponent {

  @Output() createdPlaylist: EventEmitter<void> = new EventEmitter();

  protected createPlaylistEvent(): void {
    this.createdPlaylist.emit();
  }

}
