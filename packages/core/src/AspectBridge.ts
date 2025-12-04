import { BridgeCore } from './BridgeCore';
import { BridgeInternal } from './BridgeInternal';
import { BridgeBase } from './BridgeBase';
import type { BridgeOptions } from './types';

/**
 * AspectlyBridge is the main entry point for bridge communication.
 * Use this class when running inside a WebView or iframe that needs
 * to communicate with its parent container.
 *
 * @example
 * ```typescript
 * // Inside a WebView or iframe
 * const bridge = new AspectlyBridge();
 *
 * // Initialize with handlers
 * await bridge.init({
 *   greet: async (params) => {
 *     return { message: `Hello, ${params.name}!` };
 *   }
 * });
 *
 * // Send messages to parent
 * const result = await bridge.send('someMethod', { data: 'value' });
 * ```
 */
export class AspectlyBridge extends BridgeBase {
  private cleanupSubscription: VoidFunction;

  constructor(options?: BridgeOptions) {
    const bridge = new BridgeInternal(BridgeCore.sendEvent, options);
    super(bridge);
    this.cleanupSubscription = BridgeCore.subscribe(
      bridge.handleCoreEvent as (event: unknown) => void
    );
  }

  /**
   * Cleanup bridge subscriptions
   */
  public destroy = (): void => {
    this.cleanupSubscription();
  };
}
