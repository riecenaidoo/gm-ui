/**
 * Debounce an action to limit how frequently it is called.
 *
 * @see <a href="https://developer.mozilla.org/en-US/docs/Glossary/Debounce">Debounce | MDN Glossary</a>
 */
export class Debounce {
  /**
   * Delay, in milliseconds, before the debounced action should be executed.
   */
  protected debounceDelayMs: number;

  /**
   * Handle to the timeout scheduled to execute, if any, when the {@link debounceDelayMs} period ends.
   */
  protected debounceTimeout?: ReturnType<typeof setTimeout>;

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  /**
   * @param debounceDelayMs See {@link debounce}.
   */
  public constructor(debounceDelayMs = 500) {
    this.debounceDelayMs = debounceDelayMs;
  }

  // ==========================================================================
  // API
  // ==========================================================================

  /**
   * Debounce an action.
   *
   * The execution is delayed until after a wait time ({@link debounceDelayMs}) has elapsed since the last call.
   *
   * If called again before the delay has passed, the previous timeout is cleared and the countdown restarts.
   *
   * @param action - A callback function to execute after the debounce delay.
   *
   * @see clearDebouncedAction
   */
  public debounce(action: () => void): void {
    this.clearDebouncedAction();
    this.debounceTimeout = setTimeout(action, this.debounceDelayMs);
  }

  /**
   * Clear the debounced action scheduled to be executed.
   *
   * @see debounce
   */
  public clearDebouncedAction(): void {
    if (this.debounceTimeout !== undefined) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = undefined;
    }
  }
}
