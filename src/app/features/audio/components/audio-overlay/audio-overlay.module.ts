import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AudioOverlayComponent} from "./audio-overlay.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [AudioOverlayComponent,],
  exports: [
    AudioOverlayComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class AudioOverlayModule {
}
