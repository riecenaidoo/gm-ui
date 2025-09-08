import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CatalogueStateService {
  readonly #playlistTitleFilter = new BehaviorSubject<string | undefined>(
    undefined,
  );

  /**
   * @returns an observation of what the current filter is, or `undefined` if there is none. Emits immediately.
   */
  public get playlistTitleFilter(): Observable<string | undefined> {
    return this.#playlistTitleFilter;
  }

  public set playlistTitleFilter(titleFilter: string | undefined) {
    if (titleFilter) {
      titleFilter =
        titleFilter.trim().length === 0 ? undefined : titleFilter.trim();
    }
    this.#playlistTitleFilter.next(titleFilter);
  }

  /**
   * @returns the value of the current `filter`, if it exists.
   */
  public get currentPlaylistTitleFilter(): string | undefined {
    return this.#playlistTitleFilter.value;
  }
}
