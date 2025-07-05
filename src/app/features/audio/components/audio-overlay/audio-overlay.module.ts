import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AudioOverlayComponent} from "./audio-overlay.component";
import {FormsModule} from "@angular/forms";
import {ServerSelectorComponent} from "./server-selector/server-selector.component";
import {ChannelSelectorComponent} from './channel-selector/channel-selector.component';
import {ServiceStatus} from './service-status/service-status.component';
import { ServerAudioStatusComponent } from './server-audio-status/server-audio-status.component';


@NgModule({
  declarations: [
    AudioOverlayComponent,
    ServerSelectorComponent,
    ChannelSelectorComponent,
    ServiceStatus,
    ServerAudioStatusComponent,
  ],
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
