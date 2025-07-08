/**
 * A standalone, interactive component with a tile-able layout that is represented in HTML as an `article` element.
 *
 * The `selector` of a `Tile` component is always an attribute selector of the native `article` element.
 *
 * The article must always have the `tile` style class.
 *
 * e.g:
 * ```
 * @Component({
 *   selector: 'article[...]',
 *   ...
 *   })
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
 * @see https://angular.dev/guide/components/selectors
 */
// Marker Interface
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Tile {}
