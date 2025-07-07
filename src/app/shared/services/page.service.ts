import { Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { Page } from "../models/page";

/**
 * Manages `Page` state.
 *
 * While there can be many `Overlays` on the `View` at any given time,
 * there is only ever one `Page`.
 */
@Injectable({
  providedIn: "root",
})
export class PageService {
  readonly #currentPage: WritableSignal<Page | undefined> = signal<
    Page | undefined
  >(undefined);

  /**
   * The current `Page` in the `View`.
   */
  public get currentPage(): Signal<Page | undefined> {
    return this.#currentPage;
  }

  public set currentPage(page: Page) {
    this.#currentPage.set(page);
  }
}
