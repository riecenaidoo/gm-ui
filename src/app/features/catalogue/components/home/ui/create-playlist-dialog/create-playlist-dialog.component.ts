import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {CreatePlaylistRequest} from "../../../../models/requests/create-playlist-request";
import {DialogComponent} from "../../../../../../shared/components/dialog/dialog/dialog.component";
import {Dialog} from "../../../../../../shared/models/dialog";
import {Form} from "../../../../../../shared/models/form";

@Component({
  selector: 'app-create-playlist-form',
  templateUrl: './create-playlist-dialog.component.html',
  styleUrl: './create-playlist-dialog.component.css'
})
export class CreatePlaylistDialogComponent implements Dialog, Form {

  public name: string;

  @Output()
  private createdPlaylist: EventEmitter<CreatePlaylistRequest>

  /**
   * Technically, we could just expose this as public and give direct access
   * to the `showDialog` and `hideDialog` method.
   * <p>
   * I prefer typing this component to be a `Dialog`, for semantics,
   * and for the usage pattern preference: `this.showDialog()` > `this.dialog.showDialog()`.
   *
   * @type {DialogComponent}
   * @private
   */
  @ViewChild("dialog")
  private dialog!: DialogComponent;

  public constructor() {
    this.name = "";
    this.createdPlaylist = new EventEmitter<CreatePlaylistRequest>;
  }

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
