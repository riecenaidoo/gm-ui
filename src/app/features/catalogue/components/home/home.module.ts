import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from "../../../../shared/components/dialog/dialog.module";
import {HomeComponent} from "./smart/home/home.component";
import {CreatePlaylistDialogComponent} from "./ui/create-playlist-dialog/create-playlist-dialog.component";
import {NewPlaylistTileComponent} from "./ui/new-playlist-tile/new-playlist-tile.component";
import {PlaylistTileComponent} from "./ui/playlist-tile/playlist-tile.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    HomeComponent,
    CreatePlaylistDialogComponent,
    NewPlaylistTileComponent,
    PlaylistTileComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    FormsModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {
}
