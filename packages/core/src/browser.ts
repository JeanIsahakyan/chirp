/**
 * Browser entry point for direct script inclusion.
 * Creates a global `aspectBridge` instance on the window object.
 *
 * @example
 * ```html
 * <script src="https://unpkg.com/@aspectly/core/dist/browser.js"></script>
 * <script>
 *   window.aspectBridge.init({
 *     greet: async (params) => ({ message: 'Hello!' })
 *   });
 * </script>
 * ```
 */
import { AspectlyBridge } from './AspectlyBridge';

declare global {
  interface Window {
    aspectBridge: AspectlyBridge;
  }
}

if (typeof window !== 'undefined') {
  window.aspectBridge = new AspectlyBridge();
}

export { AspectlyBridge };
