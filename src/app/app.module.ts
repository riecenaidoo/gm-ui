import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './features/catalogue/components/smart/home/home.component';
import {LayoutModule} from "./core/layout/layout.module";
import {HomeModule} from "./features/catalogue/components/ui/home/home.module";
import {provideHttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HomeModule,
  ],
  providers: [provideHttpClient()],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
