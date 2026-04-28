import { computed, signal, Signal, WritableSignal } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { defer, finalize, Observable, OperatorFunction } from "rxjs"; // Observable for documentation linking

/**
 * Utility to track the active state of one or more source {@link Observable observables} in a pipeline.
 *
 * e.g.
 *
 * ```ts
 *      type Loading = "playlist" | "songs";
 *
 *      readonly #loader: Loader<Loading> = new Loader<Loading>(["songs"]);
 *
 *      protected readonly loadingSongs: Signal<boolean> = this.#loader.isLoading("songs");
 * ```
 *
 * ```ts
 *      this.someHttpCall()
 *          .pipe(this.loader.track(), map(...))
 *          .subscribe(...);
 * ```
 *
 * @remarks Primarily meant for aggregating the state of multiple network requests
 * to derive whether any are still in-flight.
 *
 * @see track
 * @see isLoading
 */
export class Loader<K extends PropertyKey> {
  // ==========================================================================
  // Internal State
  // ==========================================================================

  /**
   * The number of tracked {@link Observable observables} that are currently active (subscribed, not yet finalised).
   */
  readonly #loaders: Map<K, WritableSignal<number>> = new Map<
    K,
    WritableSignal<number>
  >();

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  public constructor(keys: readonly K[]) {
    for (const key of keys) {
      this.#loaders.set(key, signal<number>(0));
    }
  }

  // ==========================================================================
  // API
  // ==========================================================================

  /**
   * `true` while one or more tracked {@link Observable observables} are still active (subscribed, not yet finalised).
   *
   * @see #track
   */
  public isLoading(key: K): Signal<boolean> {
    const loading: WritableSignal<number> = this.getLoader(key);
    return computed(() => {
      return loading() > 0;
    });
  }

  /**
   * Track the subscription to the source {@link Observable}.
   *
   * ```ts
   *    this.someHttpCall()
   *       .pipe(this.loader.track(), map(...))
   *       .subscribe(...);
   * ```
   *
   * @remarks If the HttpCall is in a `switchMap`, remember to use this function on the `switchMap` as it tracks the
   * source {@link Observable} it is used on.
   *
   * ```ts
   *    this.someObservableAction()
   *       .pipe(switchMap(...).pipe(this.loader.track()), map(...))
   *       .subscribe(...);
   * ```
   *
   */
  public track = <T>(key: K): OperatorFunction<T, T> => {
    const loader: WritableSignal<number> = this.getLoader(key);
    return (source) =>
      defer(() => {
        loader.update((v) => v + 1);

        return source.pipe(
          finalize(() => {
            loader.update((v) => Math.max(0, v - 1));
          }),
        );
      });
  };

  // ==========================================================================
  // Implementation Detail
  // ==========================================================================

  private getLoader(key: K): WritableSignal<number> {
    const loader: WritableSignal<number> | undefined = this.#loaders.get(key);
    if (loader == undefined) {
      throw Error(`Key ${String(key)} does not exist in Loader.`);
    }
    return loader;
  }
}
