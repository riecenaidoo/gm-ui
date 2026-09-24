import { Component, input, InputSignal } from "@angular/core";

/**
 * Project content into the component to block it with a loading spinner, while something is {@link #loading}.
 *
 * ```html
 *   <app-loading-spinner [loading]="isConnecting()">
 *     <button (click)="disconnect()">Disconnect</button>
 *   </app-loading-spinner>
 * ```
 */
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

  /**
   * Render the loading spinner while `true`, and the projected content while `false`. Defaults to `true`.
   *
   * @see {@link debounced}
   */
  public readonly loading: InputSignal<boolean> = input(true);
}
