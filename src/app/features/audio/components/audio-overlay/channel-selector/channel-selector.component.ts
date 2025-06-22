import {Component, Input} from '@angular/core';
import {Channel} from "../../../../../core/audio/models/channel";
import {SelectorComponent} from "../../../../../shared/components/selector-component";
import {ServerAudio} from '../../../../../core/audio/models/server-audio';
import {AudioService} from '../../../../../core/audio/models/audio-service';
import { NgFor, NgIf } from '@angular/common';

/**
 * TODO [design] consider defining a Channel component that renders itself,
 *  updating its display if it the one selected/if it has audio in it,
 *  if it is selected etc. The list of these components can then be in the html
 *  of the overlay rather than its own component as this is no longer a simple
 *  list selection.
 */
@Component({
    selector: 'app-channel-selector',
    templateUrl: './channel-selector.component.html',
    styleUrl: './channel-selector.component.css',
    imports: [NgFor, NgIf]
})
export class ChannelSelectorComponent extends SelectorComponent<Channel> {

  @Input({required: true})
  public channels!: Channel[];

  /**
   * TODO I may not be doing this correctly if I have to use 'null' as part of the type.
   */
  @Input({required: true})
  public serverAudio?: ServerAudio|null;

  /**
   * To pull information for what icon to render.
   */
  @Input({required: true})
  public audioService!: AudioService;

}
