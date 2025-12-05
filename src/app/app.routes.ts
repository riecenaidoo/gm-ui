import { Routes } from "@angular/router";
import { CataloguePageComponent } from "./features/storage/pages/catalogue/catalogue-page.component";
import { PlaylistPageComponent } from "./features/storage/pages/playlist/playlist-page.component";

export const routes: Routes = [
  {
    path: "",
    component: CataloguePageComponent,
  },
  {
    path: "playlists/:id",
    component: PlaylistPageComponent,
  },
];
