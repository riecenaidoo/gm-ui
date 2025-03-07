import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Song} from "../../../../../core/catalogue/models/song";

@Component({
  selector: 'app-song-table',
  templateUrl: './song-table.component.html',
  styleUrl: './song-table.component.css'
})
export class SongTableComponent {

  @Input({required:true})
  public songs!: Song[];

  @Output()
  private removingSong: EventEmitter<Song> = new EventEmitter();

  // ------ Events ------

  protected removingSongEvent(song: Song): void {
    this.removingSong.emit(song);
  }

}
