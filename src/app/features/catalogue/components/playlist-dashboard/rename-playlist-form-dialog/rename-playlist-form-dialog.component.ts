import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Playlist} from "../../../../../core/catalogue/models/playlist";
import {DialogComponent} from "../../../../../shared/components/dialog/dialog/dialog.component";
import {Dialog} from "../../../../../shared/models/dialog";
import {Form} from "../../../../../shared/models/form";

@Component({
  selector: 'app-rename-playlist-form-dialog',
  templateUrl: './rename-playlist-form-dialog.component.html',
  styleUrl: './rename-playlist-form-dialog.component.css'
})
export class RenamePlaylistFormDialogComponent implements Form, Dialog {

  #playlist!: Playlist;

  public title!: string;

  @Output()
  private renamedPlaylist: EventEmitter<string> = new EventEmitter();

  @ViewChild("dialog")
  private dialog!: DialogComponent;

  // ------ API ------

  @Input({required: true})
  public set playlist(playlist: Playlist) {
    this.#playlist = playlist;
    this.title = playlist.title;
  }

  public clearInputs(): void {
    this.title = this.#playlist.title;
  }

  public showDialog(): void {
    this.dialog.showDialog();
  }

  public hideDialog(): void {
    this.dialog.hideDialog();
  }

  // ------ Events ------

  protected renamePlaylist(): void {
    this.renamedPlaylist.emit(this.title);
  }

  // ------ Internal ------

  protected nameUnchanged(): boolean {
    return this.#playlist.title === this.title;
  }

}
