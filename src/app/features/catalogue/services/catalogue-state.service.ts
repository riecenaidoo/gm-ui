import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CatalogueStateService {
  readonly #search = new BehaviorSubject<string | undefined>(undefined);

  public get search(): Observable<string | undefined> {
    return this.#search;
  }

  public set search(term: string | undefined) {
    if (term) {
      term = term.trim().length === 0 ? undefined : term.trim();
    }
    this.#search.next(term);
  }
}
