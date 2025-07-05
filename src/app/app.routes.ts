import { Routes } from "@angular/router";
import { CataloguePlaylistsPage } from "./features/catalogue/pages/catalogue-playlists/catalogue-playlists-page.component";
import { PlaylistSongsPage } from "./features/catalogue/pages/playlist-songs/playlist-songs-page.component";

export const routes: Routes = [
  {
    path: "",
    component: CataloguePlaylistsPage,
  },
  {
    path: "playlists/:id",
    component: PlaylistSongsPage,
  },
];
