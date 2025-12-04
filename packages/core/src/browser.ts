/**
 * Browser entry point for direct script inclusion.
 * Creates a global `aspectBridge` instance on the window object.
 *
 * @example
 * ```html
 * <script src="https://unpkg.com/@aspect/core/dist/browser.js"></script>
 * <script>
 *   window.aspectBridge.init({
 *     greet: async (params) => ({ message: 'Hello!' })
 *   });
 * </script>
 * ```
 */
import { AspectBridge } from './AspectBridge';

declare global {
  interface Window {
    aspectBridge: AspectBridge;
  }
}

if (typeof window !== 'undefined') {
  window.aspectBridge = new AspectBridge();
}

export { AspectBridge };
