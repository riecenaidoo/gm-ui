import { Component, inject, OnInit } from "@angular/core";
import { PlaylistApiService } from "../../services/playlist-api.service";
import { Observable, Subject } from "rxjs";
import { Playlist } from "../../models/playlist";
import { ActivatedRoute } from "@angular/router";
import { PlaylistSong } from "../../models/playlist-song";
import { AsyncPipe } from "@angular/common";
import { SongTableComponent } from "../../components/song-table/song-table.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PageComponent } from "../page.component";
import { SongCreateFormComponent } from "../../components/song-create-form/song-create-form.component";
import { PlaylistRenameFormComponent } from "../../components/playlist-rename-form/playlist-rename-form.component";
import { FormsModule } from "@angular/forms";
import { ModalDirective } from "../../../../shared/directives/modal.directive";
import { HotkeyDirective } from "../../../../shared/directives/hotkey.directive";

@Component({
  selector: "main[app-playlist-page]",
  templateUrl: "./playlist-page.component.html",
  styleUrl: "./playlist-page.component.css",
  imports: [
    SongTableComponent,
    AsyncPipe,
    SongCreateFormComponent,
    PlaylistRenameFormComponent,
    FormsModule,
    ModalDirective,
    HotkeyDirective,
  ],
})
export class PlaylistPageComponent extends PageComponent implements OnInit {
  readonly #id: number = Number(
    inject(ActivatedRoute).snapshot.paramMap.get("id"),
  );

  readonly #playlist: Subject<Playlist> = new Subject<Playlist>();

  readonly #songs: Subject<PlaylistSong[]> = new Subject<PlaylistSong[]>();

  private playlistService: PlaylistApiService = inject(PlaylistApiService);

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

  // ------ Event Handling ------

  /**
   * Copying to clipboard might be a global utility, but for now it is localised to this page.
   * TODO When we introduce toasts, these logs should be replaced with toast messages instead.
   */
  public copySongToClipboard($event: PlaylistSong) {
    navigator.clipboard
      .writeText($event.url)
      .then(() => console.info(`Copied ${$event.url} to clipboard.`))
      .catch((err) =>
        console.error(
          `Failed to copy ${$event.url} to clipboard. Cause: ${err}`,
        ),
      );
  }

  protected removeSong(song: PlaylistSong): void {
    this.playlistService
      .deletePlaylistSong(this.#id, song)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe(() => this.fetchSongs());
  }

  protected updatePlaylist(playlist: Playlist): void {
    this.playlist = playlist;
  }

  protected deletePlaylist(): void {
    this.playlistService
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
    this.playlistService
      .getPlaylist(this.#id)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((playlist: Playlist) => (this.playlist = playlist));
  }

  protected fetchSongs(): void {
    this.playlistService
      .getPlaylistSongs(this.#id)
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe((songs: PlaylistSong[]) => this.#songs.next(songs));
  }
}
