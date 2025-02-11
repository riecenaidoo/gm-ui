import {Component, HostListener, Input} from "@angular/core";
import {Dialog} from "../../../models/dialog";

/**
 * Wraps component to present it as dialog. Unstyled.
 * <p>
 * Use `@ViewChild` to get a reference to the `DialogComponent` if you need more control over when
 * and how it displays, otherwise pass in `[display]="true"` into the selector to have it immediately display.
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent implements Dialog {

  /**
   * Indicates whether the `Dialog` should be displayed. Defaults to false.
   * @type {boolean}
   */
  @Input()
  public display: boolean;

  public constructor() {
    this.display = false;
  }

  // ------ API ------

  public showDialog(): void {
    this.display = true;
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
      this.hideDialog()
    }
  }

}
