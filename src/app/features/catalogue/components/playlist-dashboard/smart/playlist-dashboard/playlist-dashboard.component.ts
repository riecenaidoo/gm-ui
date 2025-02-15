import {Component, OnInit} from '@angular/core';
import {SubscriptionComponent} from "../../../../../../shared/components/subscription-component";
import {
  PlaylistRepositoryService
} from "../../../../../../core/catalogue/services/resources/playlist-repository.service";
import {BehaviorSubject, Observable} from "rxjs";
import {EMPTY_PLAYLIST, Playlist} from "../../../../../../core/catalogue/models/playlist";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-playlist-dashboard',
  templateUrl: './playlist-dashboard.component.html',
  styleUrl: './playlist-dashboard.component.css'
})
export class PlaylistDashboardComponent extends SubscriptionComponent implements OnInit {

  readonly #playlist$: BehaviorSubject<Playlist>;

  public constructor(private playlistRepository: PlaylistRepositoryService,
                     private route: ActivatedRoute) {
    super();
    this.#playlist$ = new BehaviorSubject(EMPTY_PLAYLIST);
  }

  public ngOnInit(): void {
    this.fetchPlaylist();
  }

  // ------ API ------

  public get playlist$(): Observable<Playlist> {
    return this.#playlist$;
  }

  // ------ Internal ------

  private fetchPlaylist(): void {
    const id: number = Number(this.route.snapshot.paramMap.get("id"));
    let fetchedPlaylist = this.playlistRepository.findById(id)
                              .subscribe((playlist: Playlist) => this.#playlist$.next(playlist));
    this.registerSubscription(fetchedPlaylist);
  }

}
