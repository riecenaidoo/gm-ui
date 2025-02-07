import {Component, OnInit} from '@angular/core';
import {PlaylistRepositoryService} from "../../../../../core/catalogue/services/resources/playlist-repository.service";
import {BehaviorSubject, Observable} from "rxjs";
import {EMPTY_PLAYLIST, Playlist} from "../../../../../core/catalogue/models/playlist";
import {SubscriptionComponent} from "../../../../../core/catalogue/components/subscription-component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent extends SubscriptionComponent implements OnInit {

  /**
   * TODO: Consider whether we should use an `Observable` rather.
   */
  private readonly _playlists$: BehaviorSubject<Playlist[]>;

  public constructor(private playlistRepository: PlaylistRepositoryService) {
    super();
    this._playlists$ = new BehaviorSubject([EMPTY_PLAYLIST]);
  }

  /**
   * TODO Consider whether we should pass `playlists$` in as an `@Input`.
   */
  public ngOnInit(): void {
    let fetchPlaylists = this.playlistRepository.findAll()
                             .subscribe((playlists: Playlist[]) => this._playlists$.next(playlists));
    this.registerSubscription(fetchPlaylists);
  }

  public get playlists$(): Observable<Playlist[]> {
    return this._playlists$;
  }

  /**
   * TODO Open up a modal to receive input (the name of the new Playlist) and then call our service.
   * Remember to refresh whatever we are observing to get our Playlists.
   */
  protected createPlaylist(): void {

  }

}
