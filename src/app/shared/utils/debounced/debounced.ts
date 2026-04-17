import { Injector, Signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";

/**
 * Debounce an {@link Signal} to limit how frequently it emits updates.
 *
 * @param signal {@link Signal} to debounce the output of.
 * @param debounceDelayMs delay, in milliseconds, before the debounced {@link Signal} should emit. Defaults to `100` ms.
 * @param [injector] optional {@link Injector} to use. Will be retrieved from the injection context, if not provided.
 * If this function is called outside an injection context, it must be provided.
 *
 * @remarks Angular 22 introduces an experimental utility of the same name.
 * If it becomes stable, it should supersede this.
 *
 * @see <a href="https://developer.mozilla.org/en-US/docs/Glossary/Debounce">Debounce | MDN Glossary</a>
 * @see <a href="https://angular.dev/guide/di/dependency-injection-context">Injection Context | Angular</a>
 */
export function debounced<T>(
  signal: Signal<T>,
  debounceDelayMs = 100,
  injector?: Injector,
) {
  const value: T = signal();
  const observable = toObservable(signal, { injector: injector }).pipe(
    debounceTime(debounceDelayMs),
  );
  return toSignal(observable, { injector: injector, initialValue: value });
}
