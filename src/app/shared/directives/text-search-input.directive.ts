import {Directive, EventEmitter, HostListener, Input, OnDestroy, Output} from '@angular/core';

/**
 * Directive over the native `input` element that emits events based on how the User interacts with the element.
 * Intended for `type=text` to debounce User interaction and only emit after they have finished typing.
 */
@Directive({
  selector: 'input[app-text-search-input]',
  standalone: true
})
export class TextSearchInputDirective implements OnDestroy {

  /**
   * The delay in milliseconds after the last User interaction before events can be emitted, i.e. if the User
   * continues to interact within this timeout, events will not fire and the timeout will start again. Only after the
   * User has stopped interaction and the timeout expires will events be allowed to fire.
   */
  @Input()
  public debounceDelayMs: number = 500;

  /**
   * Handle to the timeout scheduled to execute, if any, when the debounceDelay period ends.
   */
  private debounceTimeout?: ReturnType<typeof setTimeout>;

  /**
   * The last (trimmed) text the User searched, or `undefined` if they cleared their search.
   */
  private searching?: string;

  // ------ API ------

  /**
   * The text searched by the User. Never null, nor blank.
   */
  @Output()
  public searchedText: EventEmitter<string> = new EventEmitter();

  /**
   * If the User was searching, and has now cleared their search text. Guaranteed to emit only once per clear event.
   * Will only fire again once the User has begun to search non-blank text.
   */
  @Output()
  public searchCleared: EventEmitter<void> = new EventEmitter();

  // ------ Event Handling ------

  /**
   * Debounce the native `input` event to provide a grace period during User interaction (typing)
   * before emitting one of the following events:
   *
   * - a `searchedText` event if the User has inputted non-blank input, different from what was last searched, or,
   * - a `searchCleared` event if they have cleared their search (inputted only blank input).
   */
  @HostListener("input", ["$event.target.value"])
  private debounceUserInput(searchText: string): void {
    this.clearDebounceTimeout();
    this.debounceTimeout = setTimeout(() => {
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

    }, this.debounceDelayMs);
  }

  // ------ Internal ------

  public ngOnDestroy(): void {
    this.clearDebounceTimeout();
  }

  private clearDebounceTimeout(): void {
    if (this.debounceTimeout !== undefined) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = undefined;
    }
  }

}
