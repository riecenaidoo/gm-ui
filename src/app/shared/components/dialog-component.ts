import {Directive, HostListener} from "@angular/core";

/**
 * A component that is presented as dialog.
 * <br>
 * Children of this component should be wrapped within a `ngTemplate`,
 * so their content is only rendered (added to the DOM) when needed (see `get display`).
 * <br>
 * `@Directive()` is required as the class leverages ng feature `@HostListener()`.
 * For this to compile, we must use an explicit ng decorator.
 */
@Directive()
export abstract class DialogComponent {

  private _display: boolean;

  /**
   * The alternative to using this flag is to get the `ElementRef` of this component,
   * and on `document:click` inspect the event to see whether the click was targeting the component or not.
   * <br>
   * I am not sure whether that would work with `ngTemplate > #ngIf` which I'd be using in combination with these dialogs.
   *
   * @type {boolean}
   * @private
   */
  private _clickedInside: boolean;

  protected constructor() {
    this._display = false;
    this._clickedInside = false;
  }

  // ------ API ------

  public showDialog(): void {
    this._display = true;
    this._clickedInside = true;
  }

  public hideDialog(): void {
    this._display = false;
    this._clickedInside = false;
  }

  /**
   * In general, this should be the target of the `ngIf` controlling whether the dialog should be displayed or not.
   *
   * @returns {boolean} true if the dialog should be displayed.
   */
  public get display(): boolean {
    return this._display;
  }

  // ------ Dialog Services ------

  /*
    If I understand how `@HostListener` works,
    these listeners would be create and active when the component loads - which I don't want.
    I only want these listeners to be present & active when the Dialog is first activated and shows up.

    TODO Figure out how to dynamically bind these listeners when `showDialog` is called.
  */

  /**
   * Props to <a href=https://stackoverflow.com/a/42349004>Sawant on SO</a>.
   * Didn't know you can use `keydown.escape`, thought you'd need to look at the event.
   * TODO: Look into when that was introduced?
   */
  @HostListener("document:keydown.escape")
  protected hideOnEscapePress(): void {
    if (this._display) {
      this.hideDialog()
    }
  }

  @HostListener("click")
  protected detectClickInside() {
    this._clickedInside = true;
  }

  /**
   * Many props to <a href=https://stackoverflow.com/a/46656671>J. Frankenstein on SO</a>.
   * Thought I'd have to do something ugly with inspecting the event to see what the target was
   * and whether it was this component.
   */
  @HostListener("document:click")
  protected hideOnClickOutside(): void {
    if (this._display && !this._clickedInside) {
      this.hideDialog()
    } else {
      this._clickedInside = false;
    }
  }

}
