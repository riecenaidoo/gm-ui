import {Component, Input} from '@angular/core';
import {AudioService} from "../../../../../core/audio/models/audio-service";

@Component({
    selector: 'app-service-status',
    templateUrl: './service-status.component.html',
    styleUrl: './service-status.component.css',
    standalone: false
})
export class ServiceStatus {

  @Input({required: true})
  public audioService!: AudioService;

}
