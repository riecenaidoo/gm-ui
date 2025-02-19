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
export class RenamePlaylistFormDialogComponent implements Form, Dialog{

  #playlist!: Playlist;

  public name!: string;

  @Output()
  private renamedPlaylist: EventEmitter<Playlist> = new EventEmitter();

  @ViewChild("dialog")
  private dialog!: DialogComponent;

  // ------ API ------

  @Input()
  set playlist(playlist: Playlist) {
    this.#playlist = playlist;
    this.name = playlist.name;
  }

  public clearInputs(): void {
    this.name = this.#playlist.name;
  }

  public showDialog(): void {
    this.dialog.showDialog();
  }

  public hideDialog(): void {
    this.dialog.hideDialog();
  }

  // ------ Events ------

  protected renamePlaylist(): void {
    const playlist: Playlist = {name: this.name};
    this.renamedPlaylist.emit(playlist);
  }

  // ------ Internal ------

  protected nameUnchanged(): boolean{
    return this.#playlist.name === this.name;
  }

}
