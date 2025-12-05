import { Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";

/**
 * Manages `Catalogue` state that must be retained between `Page` changes.
 *
 * @see PageComponent
 * @remarks
 * State defined here will never be cleared, because `Catalogue` routes are always active.
 * They are the main content of the application.
 *
 * It is acceptable to add further state for UX, but never for DX.
 */
@Injectable({
  providedIn: "root",
})
export class CatalogueStateService {
  /**
   * Cache of the current `Playlist` filter input from the User.
   *
   * The filter defines the slice of `Playlists` the User is currently working with.
   * When they navigate into a specific `Playlist`, perform some actions, and return,
   * the filter should remain in place, to ensure that they can continue where they left off
   * i.e. maintain their context.
   */
  readonly #playlistTitleFilter: WritableSignal<string | undefined> = signal<
    string | undefined
  >(undefined);

  /**
   * @returns An {@link Observable} of the `playlistTitleFilter`.
   * @remarks Provided for interop with Rxjs. Prefer the signal accessor in components whenever possible.
   * @see #playlistTitleFilter
   */
  public playlistTitleFilter$: Observable<string | undefined> = toObservable(
    this.playlistTitleFilter,
  );

  /**
   * The {@link Playlist#title} filter, which is a text fragment (`string`) that a {@link Playlist#title} must match against.
   * It is case-insensitive, and optional.
   * If a filter is defined, it is guaranteed to be non-blank.
   *
   * @see PlaylistsApiService#findByTitle
   */
  public get playlistTitleFilter(): Signal<string | undefined> {
    return this.#playlistTitleFilter;
  }

  /**
   * @remarks Will only update if the {@link titleFilter} is distinct.
   */
  public set playlistTitleFilter(titleFilter: string | undefined) {
    if (titleFilter != undefined) {
      titleFilter = titleFilter.trim();
      titleFilter = titleFilter.length === 0 ? undefined : titleFilter;
    }
    if (titleFilter !== this.#playlistTitleFilter()) {
      this.#playlistTitleFilter.set(titleFilter);
    }
  }
}
