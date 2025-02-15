import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaylistDashboardComponent} from './smart/playlist-dashboard/playlist-dashboard.component';

@NgModule({
  declarations: [
    PlaylistDashboardComponent
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
