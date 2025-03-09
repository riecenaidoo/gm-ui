import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Channel} from "../../../../../core/audio/models/channel";

@Component({
  selector: 'app-channel-selector',
  templateUrl: './channel-selector.component.html',
  styleUrl: './channel-selector.component.css'
})
export class ChannelSelectorComponent {

  @Input({required: true})
  public channels!: Channel[];

  public selectedChannel?: Channel;

  @Output()
  private channelSelected: EventEmitter<Channel> = new EventEmitter();

  // ------ Event Handling ------

  protected selectChannel(channel: Channel): void {
    this.selectedChannel = channel;
    this.channelSelected.emit(channel);
  }

}
