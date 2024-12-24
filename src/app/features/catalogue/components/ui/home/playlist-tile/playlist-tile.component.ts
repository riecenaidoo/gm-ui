import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-playlist-tile',
  templateUrl: './playlist-tile.component.html',
  styleUrl: './playlist-tile.component.css'
})
export class PlaylistTileComponent {

  @Input() public name: string = "Playlist Name";

}
