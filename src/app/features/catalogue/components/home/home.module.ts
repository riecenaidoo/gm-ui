import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from "../../../../shared/components/dialog/dialog.module";
import {HomeComponent} from "./home.component";
import {NewPlaylistTileComponent} from "./tiles/new-playlist-tile/new-playlist-tile.component";
import {PlaylistTileComponent} from "./tiles/playlist-tile/playlist-tile.component";
import {FormsModule} from "@angular/forms";
import {CreatePlaylistFormDialogComponent} from "./create-playlist-form-dialog/create-playlist-form-dialog.component";
import {TextSearchInputDirective} from '../../../../shared/directives/text-search-input.directive';

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
    FormsModule,
    TextSearchInputDirective,
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {
}
