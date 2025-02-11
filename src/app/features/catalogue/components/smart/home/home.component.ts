import {Component, OnInit, ViewChild} from '@angular/core';
import {PlaylistRepositoryService} from "../../../../../core/catalogue/services/resources/playlist-repository.service";
import {BehaviorSubject, Observable} from "rxjs";
import {EMPTY_PLAYLIST, Playlist} from "../../../../../core/catalogue/models/playlist";
import {SubscriptionComponent} from "../../../../../shared/components/subscription-component";
import {CreatePlaylistRequest} from "../../../models/requests/create-playlist-request";
import {CreatePlaylistDialogComponent} from "../../ui/home/create-playlist-dialog/create-playlist-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent extends SubscriptionComponent implements OnInit {

  /**
   * TODO: Consider whether we should use an `Observable` rather.
   */
  readonly #playlists$: BehaviorSubject<Playlist[]>;

  @ViewChild("createPlaylistDialog")
  private createPlaylistDialog!: CreatePlaylistDialogComponent;

  /**
   * I find the instantiation using `EMPTY_PLAYLIST` to be messy.
   * <br>
   * TODO Consider whether we should pass `playlists$` in as an `@Input`.
   *
   * @param {PlaylistRepositoryService} playlistRepository
   */
  public constructor(private playlistRepository: PlaylistRepositoryService) {
    super();
    this.#playlists$ = new BehaviorSubject([EMPTY_PLAYLIST]);
  }

  public ngOnInit(): void {
    this.fetchPlaylists();
  }

  // ------ API ------

  public get playlists$(): Observable<Playlist[]> {
    return this.#playlists$;
  }

  // ------ Event Handling ------

  /**
   * The user has created a playlist, and we must coordinate with the service to issue the request.
   */
  protected createPlaylist(playlist: CreatePlaylistRequest): void {
    let createdPlaylist = this.playlistRepository.createPlaylist(playlist)
                              .subscribe((_) => {
                                this.fetchPlaylists();
                                this.createPlaylistDialog.clearInputs();
                                this.createPlaylistDialog.hideDialog();
                              })
    this.registerSubscription(createdPlaylist);
  }

  /**
   * The user has selected a `Playlist` to view.
   */
  protected openPlaylist(playlist: Playlist): void {
    // TODO: Impl
    console.log(`Opening: ${JSON.stringify(playlist)}`)
  }

  // ------ Internal ------

  private fetchPlaylists(): void {
    let fetchedPlaylists = this.playlistRepository.findAll()
                               .subscribe((playlists: Playlist[]) => this.#playlists$.next(playlists));
    this.registerSubscription(fetchedPlaylists);
  }

}
