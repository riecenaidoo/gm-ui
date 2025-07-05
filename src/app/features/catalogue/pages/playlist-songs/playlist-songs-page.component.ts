import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { SubscriptionComponent } from "../../../../shared/components/subscription-component";
import { PlaylistsApiService } from "../../../../core/catalogue/services/playlists-api.service";
import { Observable, Subject } from "rxjs";
import { Playlist } from "../../../../core/catalogue/models/playlist";
import { ActivatedRoute, Router } from "@angular/router";
import { PlaylistSong } from "../../../../core/catalogue/models/playlist-song";
import { SongCreateFormDialogComponent } from "../../components/song-create-form-dialog/song-create-form-dialog.component";
import { PlaylistRenameFormDialogComponent } from "../../components/playlist-rename-form-dialog/playlist-rename-form-dialog.component";
import { PlaylistSongsApiService } from "../../../../core/catalogue/services/playlist-songs-api.service";
import { PlaylistSongsCreateRequest } from "../../../../core/catalogue/models/requests/playlist-songs-create-request";
import { AsyncPipe } from "@angular/common";
import { SongTableComponent } from "../../components/song-table/song-table.component";

@Component({
  selector: "app-playlist-songs-page",
  templateUrl: "./playlist-songs-page.component.html",
  styleUrl: "./playlist-songs-page.component.css",
  imports: [
    SongCreateFormDialogComponent,
    PlaylistRenameFormDialogComponent,
    SongTableComponent,
    AsyncPipe,
  ],
})
export class PlaylistSongsPage extends SubscriptionComponent implements OnInit {
  readonly #id: number = Number(
    inject(ActivatedRoute).snapshot.paramMap.get("id"),
  );

  readonly #playlist: Subject<Playlist> = new Subject<Playlist>();

  readonly #songs: Subject<PlaylistSong[]> = new Subject<PlaylistSong[]>();

  @ViewChild("addSongFormDialog")
  private addSongFormDialog!: SongCreateFormDialogComponent;

  @ViewChild("renamePlaylistFormDialog")
  protected renamePlaylistFormDialog!: PlaylistRenameFormDialogComponent;

  private playlistsService: PlaylistsApiService = inject(PlaylistsApiService);

  private playlistSongsService: PlaylistSongsApiService = inject(
    PlaylistSongsApiService,
  );

  private router: Router = inject(Router);

  public constructor() {
    super();
  }

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
    this.addSongFormDialog.showDialog();
  }

  @HostListener("window:keydown.alt.2")
  protected showRenamePlaylistDialog(): void {
    this.renamePlaylistFormDialog.showDialog();
  }

  // ------ Event Handling ------

  protected addSong(song: PlaylistSongsCreateRequest): void {
    const addedSong = this.playlistSongsService
      .createPlaylistSong(this.#id, song)
      .subscribe(() => {
        this.fetchSongs();
        this.addSongFormDialog.hideDialog();
        this.addSongFormDialog.clearInputs();
      });
    this.registerSubscription(addedSong);
  }

  protected removeSong(song: PlaylistSong): void {
    const removedSong = this.playlistSongsService
      .deletePlaylistSong(this.#id, song)
      .subscribe(() => this.fetchSongs());
    this.registerSubscription(removedSong);
  }

  protected renamePlaylist(title: string): void {
    const renamedPlaylist = this.playlistsService
      .updatePlaylist(this.#id, { title })
      .subscribe((playlist: Playlist) => {
        this.#playlist.next(playlist);
        this.renamePlaylistFormDialog.hideDialog();
      });
    this.registerSubscription(renamedPlaylist);
  }

  protected deletePlaylist(): void {
    const deletedPlaylist = this.playlistsService
      .deletePlaylist(this.#id)
      .subscribe(() => {
        this.router.navigate([""]).then((routed: boolean) => {
          if (!routed) {
            // TODO Add toasts
            // TODO This will be a common `.then` block. Extract it somehow.
            console.log("Failed to load requested route.");
          }
        });
      });
    this.registerSubscription(deletedPlaylist);
  }

  // ------ Internal ------

  private fetchPlaylist(): void {
    const fetchedPlaylist = this.playlistsService
      .findById(this.#id)
      .subscribe((playlist: Playlist) => this.#playlist.next(playlist));
    this.registerSubscription(fetchedPlaylist);
  }

  private fetchSongs(): void {
    const fetchedSongs = this.playlistSongsService
      .getPlaylistSongs(this.#id)
      .subscribe((songs: PlaylistSong[]) => this.#songs.next(songs));
    this.registerSubscription(fetchedSongs);
  }
}
