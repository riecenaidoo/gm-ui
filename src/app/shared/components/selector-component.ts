import {Directive, EventEmitter, Output} from "@angular/core";

/**
 * A component that selects an item.
 *
 * <T> - the type of the item(s) being selected.
 */
@Directive()
export abstract class SelectorComponent<T> {

  @Output()
  private selected: EventEmitter<T> = new EventEmitter();

  /**
   * Emit an event containing the item that was selected.
   *
   * @param item that was selected.
   */
  protected select(item: T): void {
    this.selected.emit(item);
  }

}
