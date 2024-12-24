import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaylistTileComponent} from './playlist-tile/playlist-tile.component';
import {NewPlaylistTileComponent} from './new-playlist-tile/new-playlist-tile.component';

@NgModule({
  declarations: [
    PlaylistTileComponent,
    NewPlaylistTileComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlaylistTileComponent,
    NewPlaylistTileComponent
  ]
})
export class HomeModule {
}
