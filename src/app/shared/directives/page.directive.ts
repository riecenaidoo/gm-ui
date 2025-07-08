import { Directive } from "@angular/core";

/**
 * The dominant, routed component of the view that is represented in HTML as a `main` element.
 *
 * The `selector` of a `Page` component is always an attribute selector of the native `main` element.
 *
 * The component must always have the `page` style class.
 *
 * The page may never overflow.
 * If the content is too large to be rendered on the view part,
 * the overflowing content must be contained in an element with the `page-scrolling` style class.
 *
 * If there are page-wide interactions available, they must be wrapped within a `ControlBar`,
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
export class PageDirective {}
