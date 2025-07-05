import {Component, Input} from '@angular/core';
import {Server} from "../../../../../core/audio/models/server";
import {SelectorComponent} from "../../../../../shared/components/selector-component";

@Component({
  selector: 'app-server-selector',
  templateUrl: './server-selector.component.html',
  styleUrl: './server-selector.component.css'
})
export class ServerSelectorComponent extends SelectorComponent<Server> {

  @Input({required: true})
  public servers!: Server[];

  public selectedServer?: Server;

}
