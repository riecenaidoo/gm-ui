import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { PlaylistsApiService } from "../../services/playlists-api.service";
import { Observable, Subject } from "rxjs";
import { Playlist } from "../../models/playlist";
import { ActivatedRoute } from "@angular/router";
import { PlaylistSong } from "../../models/playlist-song";
import { PlaylistSongsApiService } from "../../services/playlist-songs-api.service";
import { PlaylistSongsCreateRequest } from "../../models/requests/playlist-songs-create-request";
import { AsyncPipe } from "@angular/common";
import { SongTableComponent } from "../../components/song-table/song-table.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PageComponent } from "../page.component";
import { DialogComponent } from "../../../../shared/components/dialog/dialog/dialog.component";
import { SongCreateFormComponent } from "../../components/song-create-form/song-create-form.component";
import { PlaylistRenameFormComponent } from "../../components/playlist-rename-form/playlist-rename-form.component";
import { FormsModule } from "@angular/forms";
import { PlaylistsPatchRequest } from "../../models/requests/playlists-patch-request";

@Component({
  // Intentional `main` attribute-selector.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "main[app-playlist-songs-page]",
  templateUrl: "./playlist-songs-page.component.html",
  styleUrl: "./playlist-songs-page.component.css",
  imports: [
    SongTableComponent,
    AsyncPipe,
    DialogComponent,
    SongCreateFormComponent,
    PlaylistRenameFormComponent,
    FormsModule,
  ],
})
export class PlaylistSongsPage extends PageComponent implements OnInit {
  readonly #id: number = Number(
    inject(ActivatedRoute).snapshot.paramMap.get("id"),
  );

  readonly #playlist: Subject<Playlist> = new Subject<Playlist>();

  readonly #songs: Subject<PlaylistSong[]> = new Subject<PlaylistSong[]>();

  @ViewChild("addSongDialog")
  private addSongDialog!: DialogComponent;

  @ViewChild("renamePlaylistDialog")
  protected renamePlaylistDialog!: DialogComponent;

  private playlistsService: PlaylistsApiService = inject(PlaylistsApiService);

  private playlistSongsService: PlaylistSongsApiService = inject(
    PlaylistSongsApiService,
  );

  public ngOnInit(): void {
    this.fetchPlaylist();
    this.fetchSongs();
  }

  // ------ Component ------

  protected get playlist(): Observable<Playlist> {
    return this.#playlist;
  }

  protected get songs(): Observable<PlaylistSong[]> {
    return this.#songs;
  }

  // ------ Hotkeys ------

  @HostListener("window:keydown.alt.1")
  protected showAddSongDialog(): void {
    this.addSongDialog.showDialog();
  }

  @HostListener("window:keydown.alt.2")
  protected showRenamePlaylistDialog(): void {
    this.renamePlaylistDialog.showDialog();
  }

  // ------ Event Handling ------

  protected addSong(song: PlaylistSongsCreateRequest): void {
    this.playlistSongsService
      .createPlaylistSong(this.#id, song)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe(() => {
        this.fetchSongs();
        this.addSongDialog.hideDialog();
      });
  }

  protected removeSong(song: PlaylistSong): void {
    this.playlistSongsService
      .deletePlaylistSong(this.#id, song)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe(() => this.fetchSongs());
  }

  protected updatePlaylist(patch: PlaylistsPatchRequest): void {
    this.playlistsService
      .updatePlaylist(this.#id, patch)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((playlist: Playlist) => {
        this.playlist = playlist;
        this.renamePlaylistDialog.hideDialog();
      });
  }

  protected deletePlaylist(): void {
    this.playlistsService
      .deletePlaylist(this.#id)
      .pipe(takeUntilDestroyed(this.destroyed))
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

  // ------ Internal ------

  // Intentional. Internal mutation utility.
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  private set playlist(playlist: Playlist) {
    this.#playlist.next(playlist);
    this.pageService.currentPage = {
      title: playlist.title,
    };
  }

  private fetchPlaylist(): void {
    this.playlistsService
      .findById(this.#id)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((playlist: Playlist) => (this.playlist = playlist));
  }

  private fetchSongs(): void {
    this.playlistSongsService
      .getPlaylistSongs(this.#id)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((songs: PlaylistSong[]) => this.#songs.next(songs));
  }
}
