import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { DialogComponent } from "../../../../shared/components/dialog/dialog/dialog.component";
import { Dialog } from "../../../../shared/models/dialog";
import { Form } from "../../../../shared/models/form";
import { PlaylistsCreateRequest } from "../../models/requests/playlists-create-request";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-playlist-create-form-dialog",
  templateUrl: "./playlist-create-form-dialog.component.html",
  styleUrl: "./playlist-create-form-dialog.component.css",
  imports: [DialogComponent, FormsModule],
})
export class PlaylistCreateFormDialogComponent implements Form, Dialog {
  public title = "";

  @Output()
  private createdPlaylist: EventEmitter<PlaylistsCreateRequest> =
    new EventEmitter<PlaylistsCreateRequest>();

  @ViewChild("dialog")
  private dialog!: DialogComponent;

  // ------ API ------

  /**
   * Clear inputs on the form.
   */
  public clearInputs(): void {
    this.title = "";
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
      title: this.title,
    };
    this.createdPlaylist.emit(playlist);
  }

  // ------ Internal ------

  protected noInput(): boolean {
    return this.title.trim().length === 0;
  }
}
