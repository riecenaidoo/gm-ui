import { computed, Signal, signal, WritableSignal } from "@angular/core";
import { defer, finalize, Observable, OperatorFunction } from "rxjs";

/**
 * Utility to track the state of one or more source {@link Observable observables} in a pipeline.
 *
 * e.g.
 *
 * ```ts
 *    this.someHttpCall()
 *       .pipe(this.loader.track(), map(...))
 *       .subscribe(...);
 * ```
 *
 * Render loading state in a component
 *
 * ```html
 *    [...]="loader.isLoading()"
 * ```
 *
 * Multiple {@link Observable observables} can be tracked under the same {@link Loader} to aggregate their state.
 *
 * ```ts
 *      this.someHttpCall()
 *          .pipe(this.loader.track(), map(...))
 *          .subscribe(...);
 *
 *      this.someOtherHttpCall()
 *          .pipe(this.loader.track(), map(...))
 *          .subscribe(...);
 *
 *      // true if someHttpCall || someOtherHttpCall is active (subscribed, not yet finalised i.e. still in-flight).
 *      protected readonly loadingData: Signal<boolean> = this.#loader.isLoading();
 * ```
 *
 * @remarks Bridges Rxjs {@link Observable} API (see {@link #track}) currently used to handle data-fetching pipelines,
 * and Angular {@link Signal} API (see {@link #isLoading}) currently used to manage component state.
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
   * @see track
   */
  public readonly isLoading: Signal<boolean> = computed(
    () => this.#loading() > 0,
  );

  /**
   * Track whether the source {@link Observable} is active (subscribed, not yet finalised).
   *
   * ```ts
   *    this.someHttpCall()
   *       .pipe(this.loader.track(), map(...))
   *       .subscribe(...);
   * ```
   *
   * @remarks Originally for tracking the status of an HTTP call subscription,
   * which completes once the response is received.
   * If the HTTP call is performed within a `switchMap` operation,
   * remember to use this {@link OperatorFunction} on the `switchMap` directly,
   * as it tracks the source {@link Observable} it is used on.
   *
   * ```ts
   *    this.someObservableAction()
   *       .pipe(switchMap(...).pipe(this.loader.track()), map(...))
   *       .subscribe(...);
   * ```
   *
   * @see isLoading
   */
  public track<T>(): OperatorFunction<T, T> {
    return (source: Observable<T>) =>
      defer(() => {
        this.#loading.update((v) => v + 1);

        return source.pipe(
          finalize(() => {
            this.#loading.update((v) => Math.max(0, v - 1));
          }),
        );
      });
  }
}
