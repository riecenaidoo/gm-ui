import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal,
} from "@angular/core";
import { combineLatest, startWith, switchMap } from "rxjs";
import { Playlist } from "../../models/playlist";
import { PlaylistApiService } from "../../services/playlist-api.service";
import { PlaylistCreateFormComponent } from "../../components/playlist-create-form/playlist-create-form.component";
import { InputSearchDebounceDirective } from "../../../../shared/directives/input-search-debounce.directive";
import { PlaylistCreateTileComponent } from "../../components/playlist-create-tile/playlist-create-tile.component";
import { PlaylistTileComponent } from "../../components/playlist-tile/playlist-tile.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PageComponent } from "../page.component";
import { FormsModule } from "@angular/forms";
import { PlaylistStateService } from "../../services/playlist-state.service";
import { ModalDirective } from "../../../../shared/directives/modal.directive";

@Component({
  selector: "main[app-catalogue-page]",
  templateUrl: "./catalogue-page.component.html",
  styleUrl: "./catalogue-page.component.css",
  imports: [
    InputSearchDebounceDirective,
    PlaylistCreateTileComponent,
    PlaylistTileComponent,
    PlaylistCreateFormComponent,
    FormsModule,
    ModalDirective,
  ],
})
export class CataloguePageComponent extends PageComponent implements OnInit {
  // State

  readonly #playlists: WritableSignal<Playlist[]> = signal<Playlist[]>([]);

  /**
   * When the User is filtering Playlists, and there is no match, set the default title for Playlist creation to the
   * title they were searching for, for convenience.
   */
  protected readonly defaultPlaylistTitle: Signal<string | undefined> =
    computed<string | undefined>(() => {
      const filter = this.playlistStateService.playlistTitleFilter();
      return filter && this.#playlists().length === 0 ? filter : undefined;
    });

  // Components

  @ViewChild("createPlaylistDialog", { static: true })
  private createPlaylistDialog!: ElementRef<HTMLDialogElement>;

  /**
   * Input field for searching (filtering) `Playlists` within the `Catalogue`.
   */
  @ViewChild("playlistSearchInput", { static: true })
  private playlistSearchInput!: ElementRef<HTMLInputElement>;

  // Services

  private readonly playlistService: PlaylistApiService =
    inject(PlaylistApiService);

  private readonly playlistStateService: PlaylistStateService =
    inject(PlaylistStateService);

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
   * - Data is re-fetched whenever {@link PlaylistStateService#playlistTitleFilter} changes.
   *
   * @implNote {@link combineLatest} will wait for all observables to emit at least once.
   * We use {@link startWith} to trigger a first emission in order to jump start the pipeline and load the content for
   * the page initially.
   */
  private setupPlaylistsDataSource(): void {
    combineLatest([
      this.refreshed.pipe(startWith(undefined)),
      this.playlistStateService.playlistTitleFilter$.pipe(startWith(undefined)),
    ])
      .pipe(
        switchMap(([_, titleFilter]: [void, string | undefined]) =>
          titleFilter
            ? this.playlistService.getPlaylistsByTitle(titleFilter)
            : this.playlistService.getPlaylists(),
        ),
        takeUntilDestroyed(this.destroyed),
      )
      .subscribe((playlists: Playlist[]) => this.#playlists.set(playlists));
  }

  // ------ Component Data ------

  protected get playlists(): Signal<Playlist[]> {
    return this.#playlists;
  }

  protected get playlistTitleFilter(): Signal<string | undefined> {
    return this.playlistStateService.playlistTitleFilter;
  }

  // ------ Hotkey Bindings ------

  @HostListener("window:keydown.alt.1")
  protected showCreatePlaylistDialog(): void {
    this.createPlaylistDialog.nativeElement.showModal();
  }

  @HostListener("window:keydown.alt.`")
  protected focusPlaylistSearch(): void {
    window.requestAnimationFrame(() =>
      this.playlistSearchInput.nativeElement.focus(),
    );
  }

  // ------ Event Handling ------

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
    this.playlistStateService.playlistTitleFilter = $event;
  }

  /**
   * The User has cleared their filter on the `Playlists` in the `Catalogue`.
   */
  protected clearFilter() {
    this.playlistStateService.playlistTitleFilter = undefined;
  }
}
