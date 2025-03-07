import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutModule} from "./core/layout/layout.module";
import {HomeModule} from "./features/catalogue/components/home/home.module";
import {provideHttpClient} from "@angular/common/http";
import {PlaylistDashboardModule} from "./features/catalogue/components/playlist-dashboard/playlist-dashboard.module";
import {AudioOverlayModule} from "./features/audio/components/audio-overlay/audio-overlay.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HomeModule,
    PlaylistDashboardModule,
    AudioOverlayModule
  ],
  providers: [provideHttpClient()],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
