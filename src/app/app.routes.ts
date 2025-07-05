import { Routes } from "@angular/router";
import { CataloguePlaylistsPage } from "./features/catalogue/pages/catalogue-playlists/catalogue-playlists-page.component";
import { PlaylistDashboardComponent } from "./features/catalogue/components/playlist-dashboard/playlist-dashboard.component";

export const routes: Routes = [
  {
    path: "",
    component: CataloguePlaylistsPage,
  },
  {
    path: "playlists/:id",
    component: PlaylistDashboardComponent,
  },
];
