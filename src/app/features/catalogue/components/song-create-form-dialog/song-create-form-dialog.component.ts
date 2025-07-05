import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { Form } from "../../../../shared/models/form";
import { Dialog } from "../../../../shared/models/dialog";
import { DialogComponent } from "../../../../shared/components/dialog/dialog/dialog.component";
import { PlaylistSongsCreateRequest } from "../../../../core/catalogue/models/requests/playlist-songs-create-request";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-song-create-form-dialog",
  templateUrl: "./song-create-form-dialog.component.html",
  styleUrl: "./song-create-form-dialog.component.css",
  imports: [DialogComponent, FormsModule],
})
export class SongCreateFormDialogComponent implements Form, Dialog {
  public url = "";

  /**
   * Emits a URL.
   * @type {EventEmitter<String>}
   * @private
   */
  @Output()
  private addedSong: EventEmitter<PlaylistSongsCreateRequest> =
    new EventEmitter<PlaylistSongsCreateRequest>();

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
    const song: PlaylistSongsCreateRequest = { url: this.url };
    this.addedSong.emit(song);
  }

  // ------ Internal ------

  protected noInput(): boolean {
    return this.url.trim().length === 0;
  }
}
