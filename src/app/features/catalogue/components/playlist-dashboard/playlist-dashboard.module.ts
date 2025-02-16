import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaylistDashboardComponent} from './smart/playlist-dashboard/playlist-dashboard.component';
import {SongTableComponent} from './ui/song-table/song-table.component';
import {DialogModule} from "../../../../shared/components/dialog/dialog.module";
import {FormsModule} from "@angular/forms";
import {AddSongDialogComponent} from "./ui/add-song-dialog/add-song-dialog.component";

@NgModule({
  declarations: [
    PlaylistDashboardComponent,
    SongTableComponent,
    AddSongDialogComponent
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
