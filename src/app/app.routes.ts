import {Routes} from '@angular/router';
import {HomeComponent} from "./features/catalogue/components/home/home.component";
import {
  PlaylistDashboardComponent
} from "./features/catalogue/components/playlist-dashboard/playlist-dashboard.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'playlists/:id',
    component: PlaylistDashboardComponent
  }
];
