import { Component, Input } from "@angular/core";
import { Playlist } from "../../../models/playlist";
import { SelectorComponent } from "../../../../../shared/components/selector-component";
import { Tile } from "../tile";
import { NgOptimizedImage } from "@angular/common";

// Attaching to native element intentionally
/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: "article[app-playlist-tile]",
  templateUrl: "./playlist-tile.component.html",
  styleUrls: ["../tile.css", "./playlist-tile.component.css"],
  imports: [NgOptimizedImage],
})
export class PlaylistTileComponent
  extends SelectorComponent<Playlist>
  implements Tile
{
  @Input({ required: true })
  public playlist!: Playlist;
}
