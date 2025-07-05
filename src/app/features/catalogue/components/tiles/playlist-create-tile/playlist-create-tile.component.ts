import { Component, EventEmitter, Output } from "@angular/core";
import { Tile } from "../tile";

// Attaching to native element intentionally
/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: "article[app-playlist-create-tile]",
  templateUrl: "./playlist-create-tile.component.html",
  styleUrls: ["../tile.css", "./playlist-create-tile.component.css"],
})
export class PlaylistCreateTileComponent implements Tile {
  @Output()
  private creatingPlaylist: EventEmitter<void> = new EventEmitter<void>();

  // ------ Events ------

  protected creatingPlaylistEvent(): void {
    this.creatingPlaylist.emit();
  }
}
