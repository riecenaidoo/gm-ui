import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CatalogueTileComponent} from './catalogue-tile/catalogue-tile.component';
import {NewCatalogueTileComponent} from './new-catalogue-tile/new-catalogue-tile.component';

@NgModule({
  declarations: [
    CatalogueTileComponent,
    NewCatalogueTileComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CatalogueTileComponent,
    NewCatalogueTileComponent
  ]
})
export class HomeModule {
}
