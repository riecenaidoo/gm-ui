import { Component, HostListener, Input } from "@angular/core";
import { Dialog } from "../../../models/dialog";

import { OverlayComponent } from "../overlay/overlay.component";

/**
 * Wraps component to present it as dialog. Unstyled.
 * <p>
 * Use `@ViewChild` to get a reference to the `DialogComponent` if you need more control over when
 * and how it displays, otherwise pass in `[display]="true"` into the selector to have it immediately display.
 */
@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  imports: [OverlayComponent],
})
export class DialogComponent implements Dialog {
  /**
   * Indicates whether the `Dialog` should be displayed. Defaults to false.
   * @type {boolean}
   */
  @Input()
  public display: boolean;

  /**
   * The HTML `autofocus` attribute only works once on page load,
   * which is a problem in an SPA like Angular.
   *
   * This is a workaround to apply focus to an `HTMLElement` when the Dialog is opened.
   *
   * NOTE: A Directive would be ideal, but focusing requires the component to be rendered which is a problem
   * for all my current inputs that are hidden inside a Dialog.
   */
  @Input({ required: false })
  public autofocus?: HTMLElement;

  public constructor() {
    this.display = false;
  }

  // ------ API ------

  public showDialog(): void {
    this.display = true;
    if (this.autofocus) {
      window.requestAnimationFrame(() => this.autofocus!.focus());
    }
  }

  public hideDialog(): void {
    this.display = false;
  }

  // ------ Dialog Services ------

  /*
    If I understand how `@HostListener` works,
    these listeners would be created and active when the component loads - which I don't want.
    I only want these listeners to be present & active when the Dialog is first activated and shows up.
  */

  /**
   * S/O to <a href=https://stackoverflow.com/a/42349004>Sawant on SO</a>.
   * Didn't know you can use `keydown.escape`, thought you'd need to look at the event.
   */
  @HostListener("document:keydown.escape")
  protected hideOnEscapePress(): void {
    if (this.display) {
      this.hideDialog();
    }
  }
}
