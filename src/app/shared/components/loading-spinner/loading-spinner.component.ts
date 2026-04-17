import { Component, input, InputSignal } from "@angular/core";

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
}
