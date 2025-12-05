import { OutputEmitterRef } from "@angular/core";

/**
 * A form collects and manages user input for submission or interaction.
 *
 * @typeParam T The type of value this form emits after submission.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form HTML Form Element | MDN
 */
export interface Form<T> {
  /**
   * If the form is in a valid state.
   *
   * This should be used to disable form submission, and to apply the `valid` class to the button.
   *
   * ```html
   * <button type="submit" [disabled]="!isValid()" [class.valid]="isValid()"></button>
   * ```
   */
  isValid(): boolean;

  /**
   * Submit the form, if it is {@link isValid}.
   *
   * Bind this method with the form submission event listener, e.g.
   * ```ts
   * @HostListener("ngSubmit", ["$event"])
   * ```
   *
   * @remarks Each field may validate on its own, but some cases require cross-field checks before submission.
   * This method can also trigger any related side effects or follow-up actions.
   */
  submit(): void;

  /**
   * The form has been submitted.
   */
  submitted: OutputEmitterRef<T>;

  /**
   * Clear or reset all inputs in the form.
   *
   * - This should be done after form submission.
   * - If the form is in a dialog, and the dialog is closed before submission this should be manually called.
   */
  reset(): void;
}
