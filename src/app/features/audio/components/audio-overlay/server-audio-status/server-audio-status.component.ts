import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ServerAudio} from "../../../../../core/audio/models/server-audio";

@Component({
  selector: 'app-server-audio-status',
  templateUrl: './server-audio-status.component.html',
  styleUrl: './server-audio-status.component.css'
})
export class ServerAudioStatusComponent {

  @Input({required: true})
  public serverAudio!: ServerAudio;

  @Output()
  private audioDisconnected: EventEmitter<void> = new EventEmitter();

  // ------ Event Handling ------

  protected disconnectAudio() {
    this.audioDisconnected.emit();
  }

}
