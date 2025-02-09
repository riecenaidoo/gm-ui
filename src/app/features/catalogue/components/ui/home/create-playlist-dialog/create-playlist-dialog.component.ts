import {Component, EventEmitter, Output} from '@angular/core';
import {CreatePlaylistRequest} from "../../../../models/requests/create-playlist-request";
import {DialogComponent} from "../../../../../../shared/components/dialog-component";

@Component({
  selector: 'app-create-playlist-form',
  templateUrl: './create-playlist-dialog.component.html',
  styleUrl: './create-playlist-dialog.component.css'
})
export class CreatePlaylistDialogComponent extends DialogComponent {

  public name: string;

  @Output()
  private createdPlaylist: EventEmitter<CreatePlaylistRequest>

  public constructor() {
    super();
    this.name = "";
    this.createdPlaylist = new EventEmitter<CreatePlaylistRequest>;
  }

  // ------ API ------

  /**
   * Clear inputs on the form.
   * <br>
   * TODO Consider whether this would be a useful method on a form interface to define in future for myself.
   */
  public clearInputs(): void {
    this.name = ""
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
