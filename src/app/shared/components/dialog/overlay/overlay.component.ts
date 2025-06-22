import {Component, EventEmitter, HostListener, Output} from '@angular/core';

@Component({
    selector: 'app-overlay',
    templateUrl: './overlay.component.html',
    styleUrl: './overlay.component.css'
})
export class OverlayComponent {

  @Output()
  private interactedWithOverlay: EventEmitter<void>;

  public constructor() {
    this.interactedWithOverlay = new EventEmitter();
  }

  // ------ Events ------

  @HostListener("click")
  protected clickedOverlay(): void {
    this.interactedWithOverlay.emit();
  }

}
