import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { SubscriptionComponent } from "../../../../shared/components/subscription-component";
import { PlaylistsService } from "../../../../core/catalogue/services/playlists.service";
import { Observable, Subject } from "rxjs";
import { Playlist } from "../../../../core/catalogue/models/playlist";
import { ActivatedRoute, Router } from "@angular/router";
import { PlaylistSong } from "../../../../core/catalogue/models/playlist-song";
import { AddSongFormDialogComponent } from "./add-song-form-dialog/add-song-form-dialog.component";
import { RenamePlaylistFormDialogComponent } from "./rename-playlist-form-dialog/rename-playlist-form-dialog.component";
import { PlaylistSongsService } from "../../../../core/catalogue/services/playlist-songs.service";
import { PlaylistSongsCreateRequest } from "../../../../core/catalogue/models/requests/playlist-songs-create-request";
import { AsyncPipe } from "@angular/common";
import { SongTableComponent } from "./song-table/song-table.component";

@Component({
  selector: "app-playlist-dashboard",
  templateUrl: "./playlist-dashboard.component.html",
  styleUrl: "./playlist-dashboard.component.css",
  imports: [
    AddSongFormDialogComponent,
    RenamePlaylistFormDialogComponent,
    SongTableComponent,
    AsyncPipe,
  ],
})
export class PlaylistDashboardComponent
  extends SubscriptionComponent
  implements OnInit
{
  readonly #id: number = Number(
    inject(ActivatedRoute).snapshot.paramMap.get("id"),
  );

  readonly #playlist: Subject<Playlist> = new Subject<Playlist>();

  readonly #songs: Subject<PlaylistSong[]> = new Subject<PlaylistSong[]>();

  @ViewChild("addSongForm")
  private addSongForm!: AddSongFormDialogComponent;

  @ViewChild("renamePlaylistForm")
  protected renamePlaylistForm!: RenamePlaylistFormDialogComponent;

  private playlistsService: PlaylistsService = inject(PlaylistsService);

  private playlistSongsService: PlaylistSongsService =
    inject(PlaylistSongsService);

  private router: Router = inject(Router);

  public constructor() {
    super();
  }

  public ngOnInit(): void {
    this.fetchPlaylist();
    this.fetchSongs();
  }

  // ------ API ------

  public get playlist(): Observable<Playlist> {
    return this.#playlist;
  }

  public get songs(): Observable<PlaylistSong[]> {
    return this.#songs;
  }

  // ------ Hotkeys ------

  @HostListener("window:keydown.alt.1")
  protected showAddSongDialog(): void {
    this.addSongForm.showDialog();
  }

  @HostListener("window:keydown.alt.2")
  protected showRenamePlaylistDialog(): void {
    this.renamePlaylistForm.showDialog();
  }

  // ------ Event Handling ------

  protected addSong(song: PlaylistSongsCreateRequest): void {
    const addedSong = this.playlistSongsService
      .createPlaylistSong(this.#id, song)
      .subscribe(() => {
        this.fetchSongs();
        this.addSongForm.hideDialog();
        this.addSongForm.clearInputs();
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
        this.renamePlaylistForm.hideDialog();
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
