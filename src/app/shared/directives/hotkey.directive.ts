import {
  Directive,
  HostListener,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from "@angular/core";

/**
 * Bind a {@link hotkey}.
 *
 * @remarks TODO This will at some point be used to insert a small label on the parent element so that the hotkey for
 *           the button or input can be seen. If we use a combination of JS & CSS we could probably make it so on `Alt`
 *           keypress the hotkey labels are revealed.
 */
@Directive({
  selector: "[appHotkey]",
})
export class HotkeyDirective {
  /**
   * A single key, that when pressed in combination with `Alt`, will emit the {@link pressed} event.
   *
   * Case-insensitive.
   */
  public hotkey: InputSignal<string> = input.required<string>();

  /**
   * The {@link hotkey} was pressed.
   */
  public pressed: OutputEmitterRef<void> = output();

  @HostListener("window:keydown", ["$event"])
  protected triggered(event: KeyboardEvent) {
    if (
      event.altKey &&
      event.key.toLowerCase() === this.hotkey().toLowerCase()
    ) {
      event.preventDefault();
      this.pressed.emit();
    }
  }
}
