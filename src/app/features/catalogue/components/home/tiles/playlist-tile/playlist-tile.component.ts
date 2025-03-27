import {Component, Input} from '@angular/core';
import {Playlist} from "../../../../../../core/catalogue/models/playlist";
import {SelectorComponent} from "../../../../../../shared/components/selector-component";

@Component({
  selector: 'app-playlist-tile',
  templateUrl: './playlist-tile.component.html',
  styleUrls: ['../tile.css', './playlist-tile.component.css']
})
export class PlaylistTileComponent extends SelectorComponent<Playlist> {

  @Input({required: true})
  public playlist!: Playlist;

}
