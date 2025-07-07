import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  DestroyRef,
  ElementRef,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Playlist } from "../../models/playlist";
import { PlaylistsApiService } from "../../services/playlists-api.service";
import { Router } from "@angular/router";
import { PlaylistCreateFormDialogComponent } from "../../components/playlist-create-form-dialog/playlist-create-form-dialog.component";
import { PlaylistsCreateRequest } from "../../models/requests/playlists-create-request";
import { InputSearchDebounceDirective } from "../../../../shared/directives/input-search-debounce.directive";
import { PlaylistCreateTileComponent } from "../../components/tiles/playlist-create-tile/playlist-create-tile.component";
import { AsyncPipe } from "@angular/common";
import { PlaylistTileComponent } from "../../components/tiles/playlist-tile/playlist-tile.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PageService } from "../../../../shared/services/page.service";

@Component({
  selector: "app-catalogue-playlists-page",
  templateUrl: "./catalogue-playlists-page.component.html",
  styleUrl: "./catalogue-playlists-page.component.css",
  imports: [
    InputSearchDebounceDirective,
    PlaylistCreateTileComponent,
    PlaylistTileComponent,
    PlaylistCreateFormDialogComponent,
    AsyncPipe,
  ],
})
export class CataloguePlaylistsPage implements OnInit {
  readonly #playlists: Subject<Playlist[]> = new Subject<Playlist[]>();

  @ViewChild("createPlaylistFormDialog")
  private createPlaylistFormDialog!: PlaylistCreateFormDialogComponent;

  @ViewChild("playlistSearchInput")
  private playlistSearchInput!: ElementRef<HTMLInputElement>;

  private playlistsService: PlaylistsApiService = inject(PlaylistsApiService);

  private pageService: PageService = inject(PageService);

  private router: Router = inject(Router);

  private destroyed: DestroyRef = inject(DestroyRef);

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
    this.createPlaylistFormDialog.showDialog();
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
        this.createPlaylistFormDialog.clearInputs();
        this.createPlaylistFormDialog.hideDialog();
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
