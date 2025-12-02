/**
 * Browser entry point for direct script inclusion.
 * Creates a global `chirpBridge` instance on the window object.
 *
 * @example
 * ```html
 * <script src="https://unpkg.com/@aspect/core/dist/browser.js"></script>
 * <script>
 *   window.chirpBridge.init({
 *     greet: async (params) => ({ message: 'Hello!' })
 *   });
 * </script>
 * ```
 */
import { ChirpBridge } from './ChirpBridge';

declare global {
  interface Window {
    chirpBridge: ChirpBridge;
  }
}

if (typeof window !== 'undefined') {
  window.chirpBridge = new ChirpBridge();
}

export { ChirpBridge };
