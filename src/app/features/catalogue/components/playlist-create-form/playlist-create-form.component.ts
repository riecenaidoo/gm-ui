import {
  Component,
  effect,
  ElementRef,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
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
  // State

  protected title = "";

  // Components

  @ViewChild("autofocus", { static: true })
  private autoFocusTarget!: ElementRef<HTMLInputElement>;

  // I/O

  public initialTitle: InputSignal<string | undefined> = input<string>();

  public createdPlaylist: OutputEmitterRef<PlaylistsCreateRequest> =
    output<PlaylistsCreateRequest>();

  // Initialisation

  public constructor() {
    effect(() => (this.title = this.initialTitle() ?? ""));
  }

  // ==========================================================================
  // API
  // ==========================================================================

  public focus(): void {
    window.requestAnimationFrame(() =>
      this.autoFocusTarget.nativeElement.focus(),
    );
  }

  public submit(): void {
    if (!this.isValid()) {
      return;
    }

    const playlist: PlaylistsCreateRequest = {
      title: this.title,
    };
    this.createdPlaylist.emit(playlist);
  }

  public reset(): void {
    this.title = this.initialTitle() ?? "";
  }

  // ==========================================================================
  // Implementation Details
  // ==========================================================================

  /**
   * Must have input.
   */
  public isValid(): boolean {
    return this.title.trim().length !== 0;
  }
}
