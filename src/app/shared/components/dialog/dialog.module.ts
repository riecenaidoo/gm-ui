import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayComponent} from "./overlay/overlay.component";
import {DialogComponent} from "./dialog/dialog.component";


@NgModule({
  declarations: [
    DialogComponent,
    OverlayComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DialogComponent
  ]
})
export class DialogModule {
}
