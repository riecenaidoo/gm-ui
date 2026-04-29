import { computed, signal, Signal, WritableSignal } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { defer, finalize, Observable, OperatorFunction } from "rxjs"; // Observable for documentation linking

/**
 * Utility to track the state of one or more source {@link Observable observables},
 * grouped by key values.
 *
 * e.g.
 *
 * ```ts
 *      type Loading = "playlist" | "songs";
 *
 *      readonly #loader: Loader<Loading> = new Loader<Loading>(["songs"]);
 * ```
 *
 * Multiple {@link Observable observables} can be tracked under a single key value to aggregate their state.
 *
 * ```ts
 *      this.someHttpCall()
 *          .pipe(this.loader.track("songs"), map(...))
 *          .subscribe(...);
 *
 *      this.someOtherHttpCall()
 *          .pipe(this.loader.track("songs"), map(...))
 *          .subscribe(...);
 *
 *      // true if someHttpCall || someOtherHttpCall is active (subscribed, not yet finalised i.e. still in-flight).
 *      protected readonly loadingSongs: Signal<boolean> = this.#loader.isLoading("songs");
 * ```
 *
 * @remarks Bridges Rxjs {@link Observable} API (see {@link #track}) currently used to handle data-fetching pipelines,
 * to Angular {@link Signal} API (see {@link #isLoading}) currently used to manage component state.
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
  readonly #loaders: Map<K, WritableSignal<number>>;

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  /**
   * @param keys distinct loading states for this {@link Loader} to track.
   */
  public constructor(keys: readonly K[]) {
    this.#loaders = new Map<K, WritableSignal<number>>();
    for (const key of keys) {
      this.#loaders.set(key, signal<number>(0));
    }
  }

  // ==========================================================================
  // API
  // ==========================================================================

  /**
   * Track whether the source {@link Observable} is active (subscribed, not yet finalised).
   *
   * ```ts
   *    this.someHttpCall()
   *       .pipe(this.loader.track(), map(...))
   *       .subscribe(...);
   * ```
   *
   * @remarks Most commonly used to track the status of an HttpCall.
   * If the HttpCall is performed by a `switchMap` operation,
   * remember to use this {@link OperatorFunction} on the `switchMap` directly,
   * as it tracks the source {@link Observable} it is used on.
   *
   * ```ts
   *    this.someObservableAction()
   *       .pipe(switchMap(...).pipe(this.loader.track()), map(...))
   *       .subscribe(...);
   * ```
   *
   * @param key the loading state to track against.
   *
   */
  public track<T>(key: K): OperatorFunction<T, T> {
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
  }

  /**
   * `true` while one or more tracked {@link Observable observables} are still active
   * (subscribed, not yet finalised).
   *
   * @param key the loading state being queried.
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
   * `true` while any loading state tracked by this Loader is loading.
   *
   * @remarks If this implementation is refactored, ensure all `loaders` are read,
   * and the computation is not short-circuiting before reading them to ensure all {@link Signal signals} are tracked
   * for change detection.
   */
  public anyLoading(): Signal<boolean> {
    return computed(() =>
      Array.from(this.#loaders.values())
        .map((loader) => loader())
        .some((loading) => loading > 0),
    );
  }

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

export class SingleLoader extends Loader<"default"> {
  public constructor() {
    super(["default"]);
  }

  override isLoading(): Signal<boolean> {
    return super.isLoading("default");
  }

  override track<T>(): OperatorFunction<T, T> {
    return super.track("default");
  }
}
