import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaylistDashboardComponent} from './playlist-dashboard.component';
import {SongTableComponent} from './song-table/song-table.component';
import {DialogModule} from "../../../../shared/components/dialog/dialog.module";
import {FormsModule} from "@angular/forms";
import {AddSongFormDialogComponent} from "./add-song-form-dialog/add-song-form-dialog.component";

@NgModule({
  declarations: [
    PlaylistDashboardComponent,
    SongTableComponent,
    AddSongFormDialogComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    FormsModule
  ],
  exports: [
    PlaylistDashboardComponent
  ]
})
export class PlaylistDashboardModule {
}
