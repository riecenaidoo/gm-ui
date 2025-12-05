/**
 * A form collects and manages user input for submission or interaction.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form
 * @see https://angular.dev/tutorials/learn-angular/16-form-control-values
 */
export interface Form {
  isValid(): boolean;

  /**
   * Submit the form, if is {@link isValid}.
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
   * Clear or reset all inputs in the form.
   *
   * @remarks This might be triggered by the user, or automatically after submission if the form is going to be reused.
   */
  reset(): void;
}
