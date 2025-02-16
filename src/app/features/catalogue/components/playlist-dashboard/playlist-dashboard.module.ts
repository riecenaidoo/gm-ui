import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaylistDashboardComponent} from './smart/playlist-dashboard/playlist-dashboard.component';
import { SongTableComponent } from './ui/song-table/song-table.component';

@NgModule({
  declarations: [
    PlaylistDashboardComponent,
    SongTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlaylistDashboardComponent
  ]
})
export class PlaylistDashboardModule {
}
