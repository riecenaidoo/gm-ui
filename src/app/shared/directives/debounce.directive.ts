import { Directive, Input, OnDestroy } from "@angular/core";

/**
 * A directive that debounces User interaction to limit processing, event publishing, API calls, etc.
 */
@Directive()
export abstract class DebounceDirective implements OnDestroy {
  /**
   * The delay in milliseconds after the last User interaction before events can be emitted, i.e. if the User
   * continues to interact within this timeout, events will not fire and the timeout will start again. Only after the
   * User has stopped interaction and the timeout expires will events be allowed to fire.
   */
  @Input()
  public debounceDelayMs = 500;

  /**
   * Handle to the timeout scheduled to execute, if any, when the debounceDelay period ends.
   */
  protected debounceTimeout?: ReturnType<typeof setTimeout>;

  public ngOnDestroy(): void {
    this.clearDebounceTimeout();
  }

  // ------ API ------

  /**
   * Debounces an action.
   *
   * The execution is delayed until after a wait time (`debounceDelayMs`) has elapsed since the last call.
   *
   * If called again before the delay has passed, the previous timeout is cleared and the countdown restarts.
   *
   * @param action - A callback function to execute after the debounce delay.
   */
  public debounce(action: () => void): void {
    this.clearDebounceTimeout();
    this.debounceTimeout = setTimeout(action, this.debounceDelayMs);
  }

  // ------ Internal ------

  protected clearDebounceTimeout(): void {
    if (this.debounceTimeout !== undefined) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = undefined;
    }
  }
}
