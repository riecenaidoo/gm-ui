import { computed, Signal, signal, WritableSignal } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { defer, finalize, Observable, OperatorFunction } from "rxjs"; // Observable for documentation linking

/**
 * Utility to track the active state of one or more source {@link Observable observables} in a pipeline.
 *
 * e.g.
 *
 * ```ts
 *    this.someHttpCall()
 *       .pipe(this.loader.track(), map(...))
 *       .subscribe(...);
 * ```
 *
 * e.g. When using `switchMap`, make sure to bind to the correct source {@link Observable}
 *
 * ```ts
 *    this.someOtherObservable()
 *       .pipe(
 *          map(...),
 *          switchMap(() => this.someHttpCall().pipe(this.loader.track()))
 *          ).subscribe(...);
 * ```
 *
 * Render loading state in a component
 *
 * ```html
 *    [...]="loader.isLoading()"
 * ```
 *
 * @remarks Primarily meant for aggregating the state of multiple network requests
 * to derive whether any are still in-flight.
 *
 * @see track
 * @see isLoading
 */
export class Loader {
  /**
   * The number of tracked {@link Observable observables} that are currently active (subscribed, not yet finalised).
   */
  readonly #loading: WritableSignal<number> = signal<number>(0);

  /**
   * `true` while one or more tracked {@link Observable observables} are still active (subscribed, not yet finalised).
   *
   * @see #track
   */
  public readonly isLoading: Signal<boolean> = computed(
    () => this.#loading() > 0,
  );

  /**
   * Track the subscription to the source {@link Observable}.
   */
  public track = <T>(): OperatorFunction<T, T> => {
    return (source) =>
      defer(() => {
        this.#loading.update((v) => v + 1);

        return source.pipe(
          finalize(() => {
            this.#loading.update((v) => Math.max(0, v - 1));
          }),
        );
      });
  };
}
