import { DestroyRef, Directive, inject } from "@angular/core";
import { PageService } from "../services/page.service";
import { Router } from "@angular/router";

/**
 * The main routed component of the view that is represented in HTML as the `main` element.
 *
 * - The `selector` of a `Page` component is always an attribute selector of the native `main` element.
 *
 * - The component must always have the `page` style class, which is enforced by the `@Directive` on this base class.
 *
 * - The page may never overflow.
 * If the content is too large to be rendered on the view part,
 * the overflowing portion of the content should be contained in an element with the `page-scrolling` style class.
 *
 * - If there are page-wide interactions available, they must be wrapped within a `ControlBar`,
 * which must always be the first child of the `Page`.
 *
 * The purpose of the `Page` component is to keep the layout consistent between views so that navigation and control
 * elements are always located in the same areas.
 *
 * e.g:
 * ```
 * @Component({
 *   selector: 'main[...]',
 *   ...
 *   })
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/main
 * @see https://angular.dev/guide/components/selectors
 */
@Directive({
  host: {
    class: "page",
  },
})
export abstract class PageComponent {
  protected readonly pageService: PageService = inject(PageService);

  protected readonly router: Router = inject(Router);

  protected readonly destroyed: DestroyRef = inject(DestroyRef);
}

/*
TODO [design] Perhaps this could be made a structural component holding styling and without css style encapsulation.
 We potentially have multiple ng-content projections.
 */
