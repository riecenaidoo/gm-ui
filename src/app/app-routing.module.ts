import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./features/catalogue/components/home/home.component";
import {
  PlaylistDashboardComponent
} from "./features/catalogue/components/playlist-dashboard/playlist-dashboard.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'playlists/:id',
    component: PlaylistDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
