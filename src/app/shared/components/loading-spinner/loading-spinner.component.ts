import { Component, input, InputSignal, Signal } from "@angular/core";
import { Debounce } from "../../utils/debounce/debounce";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  selector: "app-loading-spinner",
  imports: [],
  templateUrl: "./loading-spinner.component.html",
  styleUrl: "./loading-spinner.component.css",
})
export class LoadingSpinnerComponent {
  // ==========================================================================
  // API
  // ==========================================================================

  public readonly loading: InputSignal<boolean> = input(false);

  public readonly debounce: InputSignal<Debounce | undefined> = input<
    Debounce | undefined
  >(new Debounce(100));

  public readonly showingSpinner: Signal<boolean>;

  // ==========================================================================
  // Initialisation
  // ==========================================================================

  public constructor() {
    const debounce = this.debounce();

    let loading$ = toObservable(this.loading).pipe(distinctUntilChanged());
    if (debounce != undefined) {
      loading$ = loading$.pipe(debounceTime(debounce.debounceDelayMs));
    }

    this.showingSpinner = toSignal(loading$, { initialValue: false });
  }
}
