import { Component, EventEmitter, Output } from "@angular/core";
import { Tile } from "../tile";

// Attaching to native element intentionally
/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: "article[app-new-playlist-tile]",
  templateUrl: "./new-playlist-tile.component.html",
  styleUrls: ["../tile.css", "./new-playlist-tile.component.css"],
})
export class NewPlaylistTileComponent implements Tile {
  @Output()
  private creatingPlaylist: EventEmitter<void> = new EventEmitter<void>();

  // ------ Events ------

  protected creatingPlaylistEvent(): void {
    this.creatingPlaylist.emit();
  }
}
