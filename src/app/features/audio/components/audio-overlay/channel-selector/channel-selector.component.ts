import {Component, Input} from '@angular/core';
import {Channel} from "../../../../../core/audio/models/channel";
import {SelectorComponent} from "../../../../../shared/components/selector-component";

@Component({
  selector: 'app-channel-selector',
  templateUrl: './channel-selector.component.html',
  styleUrl: './channel-selector.component.css'
})
export class ChannelSelectorComponent extends SelectorComponent<Channel> {

  @Input({required: true})
  public channels!: Channel[];

}
