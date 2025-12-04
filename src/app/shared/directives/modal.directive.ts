import { Directive, ElementRef, HostListener, inject } from "@angular/core";

/**
 * For mobile compatibility, dismiss the modal if the user taps outside.
 *
 * @remarks The {@link HTMLDialogElement} dismisses itself on `Esc` key-press, but this is not available on mobile.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog HTML Dialog | MDN
 */
@Directive({
  selector: "dialog[appModal]",
})
export class ModalDirective {
  readonly #el: ElementRef<HTMLDialogElement> = inject(ElementRef);

  @HostListener("click", ["$event"])
  protected dismiss(event: MouseEvent) {
    const dialog: HTMLDialogElement = this.#el.nativeElement;
    if (!dialog.open) {
      return;
    }
    const dialogBox: DOMRect = dialog.getBoundingClientRect();
    const clickedOutside = !(
      event.clientX >= dialogBox.left &&
      event.clientX <= dialogBox.right &&
      event.clientY >= dialogBox.top &&
      event.clientY <= dialogBox.bottom
    );

    if (clickedOutside) {
      dialog.close();
    }
  }
}
