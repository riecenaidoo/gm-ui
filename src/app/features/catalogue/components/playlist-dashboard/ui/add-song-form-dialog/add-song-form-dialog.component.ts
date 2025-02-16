import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Form} from "../../../../../../shared/models/form";
import {Song} from "../../../../../../core/catalogue/models/song";
import {Dialog} from '../../../../../../shared/models/dialog';
import {DialogComponent} from "../../../../../../shared/components/dialog/dialog/dialog.component";

@Component({
  selector: 'app-add-song-form-dialog',
  templateUrl: './add-song-form-dialog.component.html',
  styleUrl: './add-song-form-dialog.component.css'
})
export class AddSongFormDialogComponent implements Form, Dialog {

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
