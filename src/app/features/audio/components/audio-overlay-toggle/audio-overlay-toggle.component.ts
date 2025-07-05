import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DebounceDirective } from "../../../../shared/directives/debounce.directive";

@Component({
  selector: "app-audio-overlay-toggle",
  imports: [],
  templateUrl: "./audio-overlay-toggle.component.html",
  styleUrl: "./audio-overlay-toggle.component.css",
})
export class AudioOverlayToggleComponent extends DebounceDirective {
  #initialToggleState = false;

  /**
   * The current toggle state.
   *
   * @private
   */
  #toggle = false;

  // ------ API ------

  /**
   * The User has requested to toggle the `AudioService` on/off.
   *
   * If an `initialToggle` was provided, it will only emit when the User toggles to the other state.
   * The User input is debounced. The delay is configurable with `debounceDelayMs`.
   *
   * @type {EventEmitter<void>}
   * @protected
   * @see initialToggle
   * @see DebounceDirective.debounceDelayMs
   */
  @Output()
  protected toggled: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Set the initial state of the toggle. By default, it is `false` (i.e. off).
   *
   * A `toggled` event will only be fired when the User toggles to the other state.
   *
   * @param {boolean} isToggled
   */
  @Input({ required: false })
  public set initialToggle(isToggled: boolean) {
    this.#initialToggleState = isToggled;
    this.#toggle = isToggled;
  }

  // ------ Component ------

  protected toggledOn(): boolean {
    return this.#toggle;
  }

  // ------ Event Handling ------

  protected toggle(): void {
    this.#toggle = !this.#toggle;
    this.debounce(() => {
      if (this.#toggle !== this.#initialToggleState) {
        this.toggled.emit();
      }
    });
  }
}
