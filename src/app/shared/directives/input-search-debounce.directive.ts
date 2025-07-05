import { Directive, EventEmitter, HostListener, Output } from "@angular/core";
import { DebounceDirective } from "./debounce.directive";

/**
 * Directive over the native `input` element that emits events based on how the User interacts with the element.
 * Intended for `type=text` to debounce User interaction and only emit after they have finished typing.
 */
@Directive({
  selector: "input[appTextSearchInput]",
})
export class InputSearchDebounceDirective extends DebounceDirective {
  /**
   * The last (trimmed) text the User searched, or `undefined` if they cleared their search.
   */
  private searching?: string;

  // ------ API ------

  /**
   * The text searched by the User. Never null, nor blank.
   */
  @Output()
  protected searchedText: EventEmitter<string> = new EventEmitter<string>();

  /**
   * If the User was searching, and has now cleared their search text. Guaranteed to emit only once per clear event.
   * Will only fire again once the User has begun to search non-blank text.
   */
  @Output()
  protected searchCleared: EventEmitter<void> = new EventEmitter<void>();

  // ------ Event Handling ------

  /**
   * Debounce the native `input` event to provide a grace period during User interaction (typing)
   * before emitting one of the following events:
   *
   * - a `searchedText` event if the User has inputted non-blank input, different from what was last searched, or,
   * - a `searchCleared` event if they have cleared their search (inputted only blank input).
   */
  @HostListener("input", ["$event.target.value"])
  protected debounceUserInput(searchText: string): void {
    this.debounce(() => {
      const text = searchText.trim();
      if (text.length > 0) {
        if (this.searching !== text) {
          this.searching = text;
          this.searchedText.emit(text);
        }
      } else if (this.searching !== undefined) {
        this.searching = undefined;
        this.searchCleared.emit();
      }
    });
  }
}
