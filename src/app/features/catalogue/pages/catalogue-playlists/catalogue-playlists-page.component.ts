import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  ElementRef,
} from "@angular/core";
import { combineLatest, Observable, startWith, Subject, switchMap } from "rxjs";
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
import { CatalogueStateService } from "../../services/catalogue-state.service";

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
  // State

  readonly #playlists: Subject<Playlist[]> = new Subject<Playlist[]>();

  // Components

  @ViewChild("createPlaylistDialog")
  private createPlaylistDialog!: DialogComponent;

  /**
   * Input field for searching (filtering) `Playlists` within the `Catalogue`.
   */
  @ViewChild("playlistSearchInput")
  private playlistSearchInput!: ElementRef<HTMLInputElement>;

  // Services

  private readonly playlistsService: PlaylistsApiService =
    inject(PlaylistsApiService);

  private readonly catalogueStateService: CatalogueStateService = inject(
    CatalogueStateService,
  );

  // Initialisation

  public ngOnInit(): void {
    this.pageService.currentPage = {
      title: "Gamemaster Catalogue",
    };
    this.setupPlaylistsDataSource();
  }

  /**
   * Define the data source for {@link #playlists}.
   *
   * - Data is loaded initially.
   * - Data is reloaded on {@link PageComponent#refreshed}.
   * - Data is re-fetched whenever {@link CatalogueStateService#playlistTitleFilter} changes.
   *
   * @implNote {@link combineLatest} will wait for all observables to emit at least once.
   * The {@link CatalogueStateService#playlistTitleFilter} specifies it emits immediately,
   * but the {@link PageComponent#refreshed} does not,
   * so we use {@link startWith} to trigger a first emission in order to jump start the pipeline.
   */
  private setupPlaylistsDataSource(): void {
    combineLatest([
      this.refreshed.pipe(startWith(undefined)),
      this.catalogueStateService.playlistTitleFilter,
    ])
      .pipe(
        switchMap(([_, titleFilter]: [void, string | undefined]) =>
          titleFilter
            ? this.playlistsService.findByTitle(titleFilter)
            : this.playlistsService.findAll(),
        ),
        takeUntilDestroyed(this.destroyed),
      )
      .subscribe((playlists: Playlist[]) => this.#playlists.next(playlists));
  }

  // ------ Component Data ------

  protected get playlists(): Observable<Playlist[]> {
    return this.#playlists;
  }

  protected get currentPlaylistTitleFilter(): string {
    return this.catalogueStateService.currentPlaylistTitleFilter ?? "";
  }

  // ------ Hotkey Bindings ------

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
   * The User has created a `Playlist`. We must coordinate with the service to submit their request.
   */
  protected createPlaylist(playlist: PlaylistsCreateRequest): void {
    this.playlistsService
      .createPlaylist(playlist)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((_) => {
        this.refresh();
        this.createPlaylistDialog.hideDialog();
      });
  }

  /**
   * The User has selected a `Playlist` to view. We must navigate to it.
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
   * The User has filtered the `Playlists` in the `Catalogue`.
   */
  protected filterPlaylists($event: string) {
    this.catalogueStateService.playlistTitleFilter = $event;
  }

  /**
   * The User has cleared their filter on the `Playlists` in the `Catalogue`.
   */
  protected clearFilter() {
    this.catalogueStateService.playlistTitleFilter = undefined;
  }
}
