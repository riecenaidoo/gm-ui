import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {SubscriptionComponent} from "../../../../shared/components/subscription-component";
import {PlaylistRepositoryService} from "../../../../core/catalogue/services/resources/playlist-repository.service";
import {BehaviorSubject, Observable} from "rxjs";
import {EMPTY_PLAYLIST, Playlist} from "../../../../core/catalogue/models/playlist";
import {ActivatedRoute, Router} from "@angular/router";
import {EMPTY_SONG, Song} from "../../../../core/catalogue/models/song";
import {AddSongFormDialogComponent} from "./add-song-form-dialog/add-song-form-dialog.component";
import {RenamePlaylistFormDialogComponent} from "./rename-playlist-form-dialog/rename-playlist-form-dialog.component";

@Component({
  selector: 'app-playlist-dashboard',
  templateUrl: './playlist-dashboard.component.html',
  styleUrl: './playlist-dashboard.component.css'
})
export class PlaylistDashboardComponent extends SubscriptionComponent implements OnInit {

  readonly #id: number;

  readonly #playlist$: BehaviorSubject<Playlist> = new BehaviorSubject(EMPTY_PLAYLIST);

  readonly #songs$: BehaviorSubject<Song[]> = new BehaviorSubject([EMPTY_SONG]);

  @ViewChild("addSongForm")
  private addSongForm!: AddSongFormDialogComponent;

  @ViewChild("renamePlaylistForm")
  protected renamePlaylistForm!: RenamePlaylistFormDialogComponent;

  public constructor(private playlistRepository: PlaylistRepositoryService,
                     private route: ActivatedRoute,
                     private router: Router) {
    super();
    this.#id = Number(this.route.snapshot.paramMap.get("id"));
  }

  public ngOnInit(): void {
    this.fetchPlaylist();
    this.fetchSongs();
  }

  // ------ API ------

  public get playlist$(): Observable<Playlist> {
    return this.#playlist$;
  }

  public get songs$(): Observable<Song[]> {
    return this.#songs$;
  }

  // ------ Hotkeys ------

  @HostListener("window:keydown.alt.1")
  protected showAddSongDialog(): void {
    this.addSongForm.showDialog()
  }

  @HostListener("window:keydown.alt.2")
  protected showRenamePlaylistDialog(): void {
    this.renamePlaylistForm.showDialog();
  }

  // ------ Event Handling ------

  protected addSong(song: Song): void {
    const addedSong = this.playlistRepository.addSongsToPlaylist(this.#id, [song])
                          .subscribe(() => {
                            this.fetchSongs();
                            this.addSongForm.hideDialog();
                            this.addSongForm.clearInputs();
                          });
    this.registerSubscription(addedSong);
  }

  protected removeSong(song: Song): void {
    const removedSong = this.playlistRepository.removeSongsFromPlaylist(this.#id, [song])
                            .subscribe(() => this.fetchSongs());
    this.registerSubscription(removedSong);
  }

  protected renamePlaylist(playlist: Playlist): void {
    const renamedPlaylist = this.playlistRepository.renamePlaylist(this.#id, playlist.name)
                                .subscribe(() => {
                                  this.fetchPlaylist();
                                  this.renamePlaylistForm.hideDialog();
                                });
    this.registerSubscription(renamedPlaylist)
  }

  protected deletePlaylist(): void{
    const deletedPlaylist = this.playlistRepository.deletePlaylist(this.#id)
                                .subscribe(() => {
                                  this.router.navigate([""]).then((routed: boolean) => {
                                    if (!routed) {
                                      // TODO Add toasts
                                      // TODO This will be a common `.then` block. Extract it somehow.
                                      console.log("Failed to load requested route.")
                                    }
                                  });
                                });
    this.registerSubscription(deletedPlaylist);
  }

  // ------ Internal ------

  private fetchPlaylist(): void {
    const fetchedPlaylist = this.playlistRepository.findById(this.#id)
                                .subscribe((playlist: Playlist) => this.#playlist$.next(playlist));
    this.registerSubscription(fetchedPlaylist);
  }

  private fetchSongs(): void {
    const fetchedSongs = this.playlistRepository.getPlaylistSongs(this.#id)
                             .subscribe((songs: Song[]) => this.#songs$.next(songs));
    this.registerSubscription(fetchedSongs);
  }

}
