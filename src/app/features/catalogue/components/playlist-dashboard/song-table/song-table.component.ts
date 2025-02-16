import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EMPTY_SONG, Song} from "../../../../../core/catalogue/models/song";

@Component({
  selector: 'app-song-table',
  templateUrl: './song-table.component.html',
  styleUrl: './song-table.component.css'
})
export class SongTableComponent {

  @Input()
  public songs: Song[] = [EMPTY_SONG];

  @Output()
  private removingSong: EventEmitter<Song> = new EventEmitter();

  // ------ Events ------

  protected removingSongEvent(song: Song): void {
    this.removingSong.emit(song);
  }

}
