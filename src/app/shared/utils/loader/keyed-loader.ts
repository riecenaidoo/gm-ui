import { computed, Signal } from "@angular/core";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Observable, OperatorFunction } from "rxjs";
import { Loader } from "./loader"; // Observable for documentation linking

type Track = <T>() => OperatorFunction<T, T>;

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
export class KeyedLoader<K extends PropertyKey> {
  // ==========================================================================
  // Internal State
  // ==========================================================================

  /**
   * The number of tracked {@link Observable observables} that are currently active (subscribed, not yet finalised).
   */
  readonly #loaders: Map<K, Loader>;

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  /**
   * @param keys distinct loading states for this {@link KeyedLoader} to track.
   */
  public constructor(keys: readonly K[]) {
    this.#loaders = new Map<K, Loader>();
    const isLoading = {} as Record<K, Signal<boolean>>;
    const track = {} as Record<K, Track>;

    for (const key of keys) {
      const loader = new Loader();
      this.#loaders.set(key, loader);
      isLoading[key] = loader.isLoading;
      track[key] = loader.track.bind(loader);
    }

    this.isLoading = Object.freeze(isLoading);
    this.track = Object.freeze(track);
  }

  // ==========================================================================
  // API
  // ==========================================================================

  public readonly isLoading: Record<K, Signal<boolean>>;

  public readonly track: Record<K, Track>;

  /**
   * `true` while any loading state tracked by this Loader is loading.
   *
   * @remarks If this implementation is refactored, ensure all `loaders` are read,
   * and the computation is not short-circuiting before reading them to ensure all {@link Signal signals} are tracked
   * for change detection.
   */
  public anyLoading: Signal<boolean> = computed(() => {
    const isLoading = Array.from(this.#loaders.values()).map((loader) =>
      loader.isLoading(),
    );
    return isLoading.some(Boolean);
  });
}
