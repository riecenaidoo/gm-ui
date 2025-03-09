import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Server} from "../../../../../core/audio/models/server";

@Component({
  selector: 'app-server-selector',
  templateUrl: './server-selector.component.html',
  styleUrl: './server-selector.component.css'
})
export class ServerSelectorComponent {

  @Input({required: true})
  public servers!: Server[];

  public selectedServer?: Server;

  @Output()
  private serverSelected: EventEmitter<Server> = new EventEmitter();

  // ------ Event Handling ------

  protected selectServer(server: Server) {
    this.serverSelected.emit(server);
  }
}
