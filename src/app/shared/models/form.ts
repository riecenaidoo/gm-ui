/**
 * A form collects and manages user input for submission or interaction.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form
 * @see https://angular.dev/tutorials/learn-angular/16-form-control-values
 */
export interface Form {
  /**
   * Set focus on the form (usually the first input field).
   *
   * @remarks This allows the user to start typing immediately.
   * Once focused, they can move through the form using Tab, and submit with Enter — no mouse required.
   */
  focus(): void;

  isValid(): boolean;

  /**
   * Submit the form, if is {@link isValid}.
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
