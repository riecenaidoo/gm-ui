import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaylistTileComponent} from './playlist-tile/playlist-tile.component';
import {NewPlaylistTileComponent} from './new-playlist-tile/new-playlist-tile.component';
import {CreatePlaylistDialogComponent} from "./create-playlist-dialog/create-playlist-dialog.component";
import {FormsModule} from "@angular/forms";
import {DialogModule} from "../../../../../shared/components/dialog/dialog.module";

@NgModule({
  declarations: [
    PlaylistTileComponent,
    NewPlaylistTileComponent,
    CreatePlaylistDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule
  ],
  exports: [
    PlaylistTileComponent,
    NewPlaylistTileComponent,
    CreatePlaylistDialogComponent
  ]
})
export class HomeModule {
}
