import {Component, HostListener, OnInit, ViewChild, inject} from '@angular/core';
import {SubscriptionComponent} from "../../../../shared/components/subscription-component";
import {Observable, Subject} from "rxjs";
import {Playlist} from "../../../../core/catalogue/models/playlist";
import {PlaylistsService} from "../../../../core/catalogue/services/playlists.service";
import {Router} from "@angular/router";
import {CreatePlaylistFormDialogComponent} from "./create-playlist-form-dialog/create-playlist-form-dialog.component";
import {PlaylistsCreateRequest} from '../../../../core/catalogue/models/requests/playlists-create-request';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    standalone: false
})
export class HomeComponent extends SubscriptionComponent implements OnInit {

  readonly #playlists: Subject<Playlist[]> = new Subject<Playlist[]>();

  @ViewChild("createPlaylistForm")
  private createPlaylistForm!: CreatePlaylistFormDialogComponent;

  private playlistsService: PlaylistsService = inject(PlaylistsService);

  private router: Router = inject(Router);

  public constructor() {
    super();
  }

  public ngOnInit(): void {
    this.fetchPlaylists();
  }

  // ------ API ------

  public get playlists(): Observable<Playlist[]> {
    return this.#playlists;
  }

  // ------ Hotkeys ------

  @HostListener("window:keydown.alt.1")
  protected showCreatePlaylistDialog(): void {
    this.createPlaylistForm.showDialog();
  }

  // ------ Event Handling ------

  /**
   * The user has created a playlist, and we must coordinate with the service to issue the request.
   */
  protected createPlaylist(playlist: PlaylistsCreateRequest): void {
    const createdPlaylist = this.playlistsService.createPlaylist(playlist)
                              .subscribe((_) => {
                                this.fetchPlaylists();
                                this.createPlaylistForm.clearInputs();
                                this.createPlaylistForm.hideDialog();
                              })
    this.registerSubscription(createdPlaylist);
  }

  /**
   * The user has selected a `Playlist` to view.
   */
  protected openPlaylist(playlist: Playlist): void {
    this.router.navigate(["playlists", playlist.id])
        .then((routed: boolean) => {
          if (!routed) {
            // TODO Add toasts
            // TODO This will be a common `.then` block. Extract it somehow.
            console.log("Failed to load requested route.")
          }
        });
  }

  /**
   * @param {string} title a non-blank string containing a title, or part of a title, to filter `Playlists` by.
   */
  protected searchByTitle(title: string): void{
    const fetchedPlaylists = this.playlistsService.findByTitle(title)
                               .subscribe((playlists: Playlist[]) => this.#playlists.next(playlists));
    this.registerSubscription(fetchedPlaylists);
  }

  protected fetchPlaylists(): void {
    const fetchedPlaylists = this.playlistsService.findAll()
                               .subscribe((playlists: Playlist[]) => this.#playlists.next(playlists));
    this.registerSubscription(fetchedPlaylists);
  }

}
