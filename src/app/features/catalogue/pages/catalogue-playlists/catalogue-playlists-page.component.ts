import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  ElementRef,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Playlist } from "../../models/playlist";
import { PlaylistsApiService } from "../../services/playlists-api.service";
import { PlaylistCreateFormComponent } from "../../components/playlist-create-form/playlist-create-form.component";
import { PlaylistsCreateRequest } from "../../models/requests/playlists-create-request";
import { InputSearchDebounceDirective } from "../../../../shared/directives/input-search-debounce.directive";
import { PlaylistCreateTileComponent } from "../../components/playlist-create-tile/playlist-create-tile.component";
import { AsyncPipe } from "@angular/common";
import { PlaylistTileComponent } from "../../components/playlist-tile/playlist-tile.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PageComponent } from "../page.component";
import { DialogComponent } from "../../../../shared/components/dialog/dialog/dialog.component";
import { FormsModule } from "@angular/forms";

@Component({
  // Intentional `main` attribute-selector.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "main[app-catalogue-playlists-page]",
  templateUrl: "./catalogue-playlists-page.component.html",
  styleUrl: "./catalogue-playlists-page.component.css",
  imports: [
    InputSearchDebounceDirective,
    PlaylistCreateTileComponent,
    PlaylistTileComponent,
    PlaylistCreateFormComponent,
    AsyncPipe,
    DialogComponent,
    FormsModule,
  ],
})
export class CataloguePlaylistsPage extends PageComponent implements OnInit {
  readonly #playlists: Subject<Playlist[]> = new Subject<Playlist[]>();

  @ViewChild("createPlaylistDialog")
  private createPlaylistDialog!: DialogComponent;

  @ViewChild("playlistSearchInput")
  private playlistSearchInput!: ElementRef<HTMLInputElement>;

  private playlistsService: PlaylistsApiService = inject(PlaylistsApiService);

  public ngOnInit(): void {
    this.pageService.currentPage = {
      title: "Gamemaster Catalogue",
    };
    this.fetchPlaylists();
  }

  // ------ Component ------

  protected get playlists(): Observable<Playlist[]> {
    return this.#playlists;
  }

  // ------ Hotkeys ------

  @HostListener("window:keydown.alt.1")
  protected showCreatePlaylistDialog(): void {
    this.createPlaylistDialog.showDialog();
  }

  @HostListener("window:keydown.alt.`")
  protected focusPlaylistSearch(): void {
    window.requestAnimationFrame(() =>
      this.playlistSearchInput.nativeElement.focus(),
    );
  }

  // ------ Event Handling ------

  /**
   * The user has created a playlist, and we must coordinate with the service to issue the request.
   */
  protected createPlaylist(playlist: PlaylistsCreateRequest): void {
    this.playlistsService
      .createPlaylist(playlist)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((_) => {
        this.fetchPlaylists();
        this.createPlaylistDialog.hideDialog();
      });
  }

  /**
   * The user has selected a `Playlist` to view.
   */
  protected openPlaylist(playlist: Playlist): void {
    this.router.navigate(["playlists", playlist.id]).then((routed: boolean) => {
      if (!routed) {
        // TODO Add toasts
        // TODO This will be a common `.then` block. Extract it somehow.
        console.log("Failed to load requested route.");
      }
    });
  }

  /**
   * @param {string} title a non-blank string containing a title, or part of a title, to filter `Playlists` by.
   */
  protected searchByTitle(title: string): void {
    this.playlistsService
      .findByTitle(title)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((playlists: Playlist[]) => this.#playlists.next(playlists));
  }

  protected fetchPlaylists(): void {
    this.playlistsService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((playlists: Playlist[]) => this.#playlists.next(playlists));
  }
}
