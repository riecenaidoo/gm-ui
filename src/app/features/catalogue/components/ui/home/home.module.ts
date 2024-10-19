import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CatalogueTileComponent} from './catalogue-tile/catalogue-tile.component';


@NgModule({
  declarations: [
    CatalogueTileComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CatalogueTileComponent
  ]
})
export class HomeModule {
}
