import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaylistDashboardComponent} from './smart/playlist-dashboard/playlist-dashboard.component';
import {SongTableComponent} from './ui/song-table/song-table.component';
import {DialogModule} from "../../../../shared/components/dialog/dialog.module";
import {FormsModule} from "@angular/forms";
import {AddSongFormDialogComponent} from "./ui/add-song-form-dialog/add-song-form-dialog.component";

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
