import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Playlist } from "../../../../core/catalogue/models/playlist";
import { DialogComponent } from "../../../../shared/components/dialog/dialog/dialog.component";
import { Dialog } from "../../../../shared/models/dialog";
import { Form } from "../../../../shared/models/form";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-playlist-rename-form-dialog",
  templateUrl: "./playlist-rename-form-dialog.component.html",
  styleUrl: "./playlist-rename-form-dialog.component.css",
  imports: [DialogComponent, FormsModule],
})
export class PlaylistRenameFormDialogComponent implements Form, Dialog {
  #playlist!: Playlist;

  public title!: string;

  @Output()
  private renamedPlaylist: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild("dialog")
  private dialog!: DialogComponent;

  // ------ API ------

  @Input({ required: true })
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
