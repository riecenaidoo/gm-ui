import {
  Component,
  effect,
  inject,
  signal,
  Signal,
  WritableSignal,
} from "@angular/core";
import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from "rxjs";
import { SongTableComponent } from "../../components/song-table/song-table.component";
import { PageComponent } from "../page.component";
import { SongCreateFormComponent } from "../../components/song-create-form/song-create-form.component";
import { PlaylistRenameFormComponent } from "../../components/playlist-rename-form/playlist-rename-form.component";
import { FormsModule } from "@angular/forms";
import { ModalDirective } from "../../../../shared/directives/modal.directive";
import { HotkeyDirective } from "../../../../shared/directives/hotkey.directive";
import { ActivatedRoute, Params } from "@angular/router";
import { PlaylistSong } from "../../models/playlist-song";
import { Playlist } from "../../models/playlist";
import { PlaylistApiService } from "../../services/playlist-api.service";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { Loader } from "../../../../shared/utils/loader/loader";

type Loading = "playlist" | "songs";

@Component({
  selector: "main[app-playlist-page]",
  templateUrl: "./playlist-page.component.html",
  styleUrl: "./playlist-page.component.css",
  imports: [
    SongTableComponent,
    SongCreateFormComponent,
    PlaylistRenameFormComponent,
    FormsModule,
    ModalDirective,
    HotkeyDirective,
  ],
})
export class PlaylistPageComponent extends PageComponent {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #playlistService: PlaylistApiService = inject(PlaylistApiService);

  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  // ==========================================================================
  // Internal State
  // ==========================================================================

  readonly #refreshSongs: Subject<void> = new Subject<void>();

  readonly #loader: Loader<Loading> = new Loader<Loading>(["songs"]);

  // ==========================================================================
  // State
  // ==========================================================================

  readonly #id: Observable<number> = this.#activatedRoute.params.pipe(
    map((params: Params) => {
      const id: string = params["playlist-id"];
      if (id === undefined || id === null) {
        throw Error("Required route parameter 'playlist-id' not found.");
      }
      return Number(id);
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  readonly #playlist: WritableSignal<Playlist | undefined> = signal<
    Playlist | undefined
  >(undefined);

  readonly #songs: Observable<PlaylistSong[]> = combineLatest([
    this.refreshed.pipe(startWith(undefined)),
    this.#refreshSongs.pipe(startWith(undefined)),
    this.#id,
  ]).pipe(
    map(([_, __, id]: [void, void, number]) => id),
    switchMap((id: number) =>
      this.#playlistService
        .getPlaylistSongs(id)
        .pipe(this.#loader.track("songs")),
    ),
  );

  // ==========================================================================
  // Component
  // ==========================================================================

  protected playlist: Signal<Playlist | undefined> =
    this.#playlist.asReadonly();

  protected songs: Signal<PlaylistSong[] | undefined> = toSignal(this.#songs);

  protected readonly loadingSongs: Signal<boolean> =
    this.#loader.isLoading("songs");

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  public constructor() {
    super();
    this.setupPlaylistDatasource();
  }

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  protected updatePlaylist(playlist: Playlist): void {
    this.#playlist.set(playlist);
  }

  protected deletePlaylist(): void {
    this.#id
      .pipe(
        switchMap((id: number) => this.#playlistService.deletePlaylist(id)),
        takeUntilDestroyed(this.destroyed),
      )
      .subscribe(() => {
        this.router.navigate([""]).then((routed: boolean) => {
          if (!routed) {
            // TODO Add toasts
            // TODO This will be a common `.then` block. Extract it somehow.
            console.log("Failed to load requested route.");
          }
        });
      });
  }

  protected refreshSongs(): void {
    this.#refreshSongs.next();
  }

  protected removeSong(song: PlaylistSong): void {
    this.#id
      .pipe(
        switchMap((id: number) =>
          this.#playlistService.deletePlaylistSong(id, song),
        ),
        takeUntilDestroyed(this.destroyed),
      )
      .subscribe(() => this.refreshSongs());
  }

  // ==========================================================================
  // Implementation Details
  // ==========================================================================

  private setupPlaylistDatasource(): void {
    combineLatest([this.refreshed.pipe(startWith(undefined)), this.#id])
      .pipe(
        map(([_, id]: [void, number]) => id),
        switchMap((id: number) => this.#playlistService.getPlaylist(id)),
        takeUntilDestroyed(this.destroyed),
      )
      .subscribe(this.#playlist.set);

    effect(() => {
      const playlist = this.#playlist();
      if (playlist == undefined) {
        return;
      }
      this.pageService.currentPage = {
        title: playlist.title,
      };
    });
  }
}
