import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Form} from "../../../../../../shared/models/form";
import {Song} from "../../../../../../core/catalogue/models/song";
import {Dialog} from '../../../../../../shared/models/dialog';
import {DialogComponent} from "../../../../../../shared/components/dialog/dialog/dialog.component";

@Component({
  selector: 'app-add-song-dialog',
  templateUrl: './add-song-dialog.component.html',
  styleUrl: './add-song-dialog.component.css'
})
export class AddSongDialogComponent implements Dialog, Form {

  public url: string = "";

  /**
   * Emits a URL.
   * @type {EventEmitter<String>}
   * @private
   */
  @Output()
  private addedSong: EventEmitter<Song> = new EventEmitter();

  @ViewChild("dialog")
  private dialog!: DialogComponent;

  // ------ API ------

  public clearInputs(): void {
    this.url = "";
  }

  public showDialog(): void {
    this.dialog.showDialog();
  }

  public hideDialog(): void {
    this.dialog.hideDialog();
  }

  // ------ Events ------

  protected addSong(): void {
    const song = {url: this.url};
    this.addedSong.emit(song);
  }

}
