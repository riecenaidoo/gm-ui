import { Component, EventEmitter, HostListener, Output } from "@angular/core";

@Component({
  selector: "app-overlay",
  templateUrl: "./overlay.component.html",
  styleUrl: "./overlay.component.css",
})
export class OverlayComponent {
  @Output()
  private interactedWithOverlay: EventEmitter<void> = new EventEmitter<void>();

  // ------ Events ------

  @HostListener("click")
  protected clickedOverlay(): void {
    this.interactedWithOverlay.emit();
  }
}
