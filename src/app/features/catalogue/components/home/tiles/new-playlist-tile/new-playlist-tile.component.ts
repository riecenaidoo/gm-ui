import {Component, EventEmitter, Output} from '@angular/core';
import {Tile} from '../tile';

@Component({
  selector: 'article[app-new-playlist-tile]',
  templateUrl: './new-playlist-tile.component.html',
  styleUrls: ['../tile.css', './new-playlist-tile.component.css']
})
export class NewPlaylistTileComponent implements Tile {

  @Output()
  private creatingPlaylist: EventEmitter<void> = new EventEmitter();

  // ------ Events ------

  protected creatingPlaylistEvent(): void {
    this.creatingPlaylist.emit();
  }

}
