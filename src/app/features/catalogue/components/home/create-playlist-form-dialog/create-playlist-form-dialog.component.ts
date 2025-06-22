import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {DialogComponent} from "../../../../../shared/components/dialog/dialog/dialog.component";
import {Dialog} from "../../../../../shared/models/dialog";
import {Form} from "../../../../../shared/models/form";
import {PlaylistsCreateRequest} from '../../../../../core/catalogue/models/requests/playlists-create-request';

@Component({
    selector: 'app-create-playlist-form-dialog',
    templateUrl: './create-playlist-form-dialog.component.html',
    styleUrl: './create-playlist-form-dialog.component.css',
    standalone: false
})
export class CreatePlaylistFormDialogComponent implements Form, Dialog {

  public title = "";

  @Output()
  private createdPlaylist: EventEmitter<PlaylistsCreateRequest> = new EventEmitter<PlaylistsCreateRequest>();

  @ViewChild("dialog")
  private dialog!: DialogComponent;

  // ------ API ------

  /**
   * Clear inputs on the form.
   */
  public clearInputs(): void {
    this.title = ""
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
    const playlist: PlaylistsCreateRequest = {
      title: this.title
    }
    this.createdPlaylist.emit(playlist)
  }

  // ------ Internal ------

  protected noInput(): boolean {
    return this.title.trim().length === 0;
  }

}
