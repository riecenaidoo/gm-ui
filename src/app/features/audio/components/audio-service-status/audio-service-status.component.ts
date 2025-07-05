import { Component, Input } from "@angular/core";
import { AudioService } from "../../models/audio-service";

@Component({
  selector: "app-audio-service-status",
  templateUrl: "./audio-service-status.component.html",
  styleUrl: "./audio-service-status.component.css",
})
export class AudioServiceStatusComponent {
  @Input({ required: true })
  public audioService!: AudioService;
}
