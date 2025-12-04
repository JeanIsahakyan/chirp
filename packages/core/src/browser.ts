/**
 * Browser entry point for direct script inclusion.
 * Creates a global `aspectlyBridge` instance on the window object.
 *
 * @example
 * ```html
 * <script src="https://unpkg.com/@aspectly/core/dist/browser.js"></script>
 * <script>
 *   window.aspectlyBridge.init({
 *     greet: async (params) => ({ message: 'Hello!' })
 *   });
 * </script>
 * ```
 */
import { AspectlyBridge } from './AspectBridge';

declare global {
  interface Window {
    aspectlyBridge: AspectlyBridge;
  }
}

if (typeof window !== 'undefined') {
  window.aspectlyBridge = new AspectlyBridge();
}

export { AspectlyBridge };
