import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AudioOverlayComponent} from "./audio-overlay.component";


@NgModule({
  declarations: [AudioOverlayComponent,],
  exports: [
    AudioOverlayComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AudioOverlayModule {
}
