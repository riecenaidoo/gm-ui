import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from "../../../../shared/components/dialog/dialog.module";
import {HomeComponent} from "./smart/home/home.component";
import {NewPlaylistTileComponent} from "./ui/new-playlist-tile/new-playlist-tile.component";
import {PlaylistTileComponent} from "./ui/playlist-tile/playlist-tile.component";
import {FormsModule} from "@angular/forms";
import {
  CreatePlaylistFormDialogComponent
} from "./ui/create-playlist-form-dialog/create-playlist-form-dialog.component";

@NgModule({
  declarations: [
    HomeComponent,
    CreatePlaylistFormDialogComponent,
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
