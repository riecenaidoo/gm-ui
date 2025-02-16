import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {CreatePlaylistRequest} from "../../../../models/requests/create-playlist-request";
import {DialogComponent} from "../../../../../../shared/components/dialog/dialog/dialog.component";
import {Dialog} from "../../../../../../shared/models/dialog";
import {Form} from "../../../../../../shared/models/form";

@Component({
  selector: 'app-create-playlist-form-dialog',
  templateUrl: './create-playlist-form-dialog.component.html',
  styleUrl: './create-playlist-form-dialog.component.css'
})
export class CreatePlaylistFormDialogComponent implements Form, Dialog {

  public name: string = "";

  @Output()
  private createdPlaylist: EventEmitter<CreatePlaylistRequest> = new EventEmitter<CreatePlaylistRequest>;

  @ViewChild("dialog")
  private dialog!: DialogComponent;

  // ------ API ------

  /**
   * Clear inputs on the form.
   */
  public clearInputs(): void {
    this.name = ""
  }

  public showDialog(): void {
    this.dialog.showDialog();
  }

  public hideDialog() {
    this.dialog.hideDialog();
  }

  // ------ Events ------
  /**
   * The user has created a playlist.
   */
  public createPlaylist(): void {
    const request: CreatePlaylistRequest = {
      name: this.name
    }
    this.createdPlaylist.emit(request)
  }

}
