import {Component, OnInit} from '@angular/core';
import {SubscriptionComponent} from "../../../../../../shared/components/subscription-component";
import {
  PlaylistRepositoryService
} from "../../../../../../core/catalogue/services/resources/playlist-repository.service";
import {BehaviorSubject, Observable} from "rxjs";
import {EMPTY_PLAYLIST, Playlist} from "../../../../../../core/catalogue/models/playlist";
import {ActivatedRoute} from "@angular/router";
import {EMPTY_SONG, Song} from "../../../../../../core/catalogue/models/song";

@Component({
  selector: 'app-playlist-dashboard',
  templateUrl: './playlist-dashboard.component.html',
  styleUrl: './playlist-dashboard.component.css'
})
export class PlaylistDashboardComponent extends SubscriptionComponent implements OnInit {

  readonly #playlist$: BehaviorSubject<Playlist>;

  readonly #songs$: BehaviorSubject<Song[]>;

  public constructor(private playlistRepository: PlaylistRepositoryService,
                     private route: ActivatedRoute) {
    super();
    this.#playlist$ = new BehaviorSubject(EMPTY_PLAYLIST);
    this.#songs$ = new BehaviorSubject([EMPTY_SONG]);
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

  // ------ Event Handling ------

  protected removeSong(song: Song): void {
    console.log(`TODO Remove Song: ${JSON.stringify(song)}`)
  }

  // ------ Internal ------

  private fetchPlaylist(): void {
    const id: number = Number(this.route.snapshot.paramMap.get("id"));
    let fetchedPlaylist = this.playlistRepository.findById(id)
                              .subscribe((playlist: Playlist) => this.#playlist$.next(playlist));
    this.registerSubscription(fetchedPlaylist);
  }

  private fetchSongs(): void {
    const id: number = Number(this.route.snapshot.paramMap.get("id"));
    let fetchedSongs = this.playlistRepository.getPlaylistSongs(id)
                           .subscribe((songs: Song[]) => this.#songs$.next(songs));
    this.registerSubscription(fetchedSongs);
  }

}
