import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { Form } from "../../../../shared/models/form";
import { PlaylistsCreateRequest } from "../../models/requests/playlists-create-request";
import { FormsModule } from "@angular/forms";

@Component({
  // Intentional `form` attribute-selector.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "form[app-playlist-create-form]",
  templateUrl: "./playlist-create-form.component.html",
  styleUrl: "./playlist-create-form.component.css",
  imports: [FormsModule],
})
export class PlaylistCreateFormComponent implements Form {
  public title = "";

  @Output()
  private createdPlaylist: EventEmitter<PlaylistsCreateRequest> =
    new EventEmitter<PlaylistsCreateRequest>();

  @ViewChild("autofocus")
  private autoFocusTarget!: ElementRef<HTMLInputElement>;

  // ------ API ------

  public focus(): void {
    window.requestAnimationFrame(() =>
      this.autoFocusTarget.nativeElement.focus(),
    );
  }

  public submit(): void {
    const playlist: PlaylistsCreateRequest = {
      title: this.title,
    };
    this.createdPlaylist.emit(playlist);
  }

  public clearInputs(): void {
    this.title = "";
  }

  // ------ Internal ------

  protected noInput(): boolean {
    return this.title.trim().length === 0;
  }
}
