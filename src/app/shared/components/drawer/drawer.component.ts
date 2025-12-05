import {
  Component,
  computed,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from "@angular/core";

/**
 * An edge of the screen.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position position | CSS Property | MDN
 */
type Position = "top" | "bottom" | "left" | "right";

/**
 * A container for tangential content that can be left off-screen until the user wants to interact with it.
 *
 * - The drawer is anchored at a {@link Position} on the edge of the screen, with its toggle control at the centre.
 * - Like an actual drawer, it is closed until it is opened. When opened, it pulls out towards the center of the screen.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/aside aside | HTML Element | MDN
 * @see #position
 * @see #expanded
 */
@Component({
  selector: "app-drawer",
  imports: [],
  templateUrl: "./drawer.component.html",
  styleUrl: "./drawer.component.css",
})
export class DrawerComponent {
  // ==========================================================================
  // API
  // ==========================================================================

  /**
   * The {@link Position} of the {@link DrawerComponent} on the screen.
   *
   * It determines which edge of the screen the {@link DrawerComponent} is anchored to.
   */
  public position: InputSignal<Position> = input.required<Position>();

  /**
   * Whether the {@link DrawerComponent} has been expanded.
   *
   * @remarks The content projected into the {@link DrawerComponent} is always rendered. This provides a more seamless
   * animation when it is expanded. If the content takes significant memory, you may want to wrap your projection in a
   * structural directive to conditionally display it only when the {@link DrawerComponent} expands.
   *
   * e.g.,
   *
   * ```html
   * <app-drawer position="right" #drawer>
   *     @if (drawer.expanded()) {
   *         <img ngSrc="assets/gm-logo-blue.svg" alt="logo" height="512" width="512">
   *     }
   * </app-drawer>
   * ```
   */
  public expanded: WritableSignal<boolean> = signal<boolean>(false);

  // ==========================================================================
  // Derived State
  // ==========================================================================

  protected top: Signal<boolean> = computed(() => this.position() === "top");

  protected bottom: Signal<boolean> = computed(
    () => this.position() === "bottom",
  );

  protected left: Signal<boolean> = computed(() => this.position() === "left");

  protected right: Signal<boolean> = computed(
    () => this.position() === "right",
  );

  // ==========================================================================
  // Event Handling
  // ==========================================================================

  /**
   * @remarks For fluidity between user interaction and animation, we do not debouncing the user's interaction here.
   */
  protected toggle(): void {
    this.expanded.set(!this.expanded());
  }

  // ==========================================================================
}
