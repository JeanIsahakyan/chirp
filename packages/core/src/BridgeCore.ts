/**
 * Low-level bridge core handling platform-specific message passing
 */

export type Event = unknown;

interface BridgeCoreEvent {
  type: string;
  event: Event;
}

interface WebViewMessage {
  nativeEvent?: {
    data?: string;
  };
}

export type BridgeCoreListener = (event: Event) => void;

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * BridgeCore handles the low-level platform detection and message serialization.
 * It provides static methods for wrapping events, creating listeners, and sending messages.
 */
export class BridgeCore {
  private static BRIDGE_EVENT_TYPE = 'BridgeEvent';

  private static isJSONObject = (str: string): boolean => {
    return str.startsWith('{') && str.endsWith('}');
  };

  /**
   * Wraps an event in the bridge protocol format
   */
  public static wrapBridgeEvent = (event: Event): string => {
    return JSON.stringify({
      event,
      type: BridgeCore.BRIDGE_EVENT_TYPE,
    });
  };

  /**
   * Creates a listener wrapper that parses incoming messages
   */
  static wrapListener =
    (listener: BridgeCoreListener) =>
    (data?: string): void => {
      if (typeof data !== 'string') {
        return;
      }
      if (!data) {
        return;
      }
      let processedData = data;
      // iOS wraps JSON with additional quotes
      if (processedData.startsWith("'") && processedData.endsWith("'")) {
        processedData = processedData.substring(1, processedData.length - 1);
      }
      if (!BridgeCore.isJSONObject(processedData)) {
        return;
      }
      try {
        const eventData: BridgeCoreEvent = JSON.parse(processedData);
        if (!eventData || eventData.type !== BridgeCore.BRIDGE_EVENT_TYPE) {
          return;
        }
        listener(eventData.event);
      } catch {
        // Ignore parse errors
      }
    };

  /**
   * Creates a browser-specific message event listener
   */
  static browserListener = (listener: BridgeCoreListener) => {
    const triggerEvent = BridgeCore.wrapListener(listener);
    return (originalEvent: MessageEvent): void => {
      if (!originalEvent?.data) {
        return;
      }
      triggerEvent(originalEvent.data);
    };
  };

  /**
   * Creates a React Native WebView message listener
   */
  static webViewListener = (listener: BridgeCoreListener) => {
    const triggerEvent = BridgeCore.wrapListener(listener);
    return (originalEvent: WebViewMessage): void => {
      if (!originalEvent?.nativeEvent?.data) {
        return;
      }
      triggerEvent(originalEvent.nativeEvent.data);
    };
  };

  /**
   * Sends an event to the parent context (WebView or iframe parent)
   */
  static sendEvent = (event: Event): void => {
    const bridgeEvent = BridgeCore.wrapBridgeEvent(event);
    if (typeof window === 'undefined') {
      console.warn('Window is undefined');
      return;
    }
    const RNW = window.ReactNativeWebView;
    if (typeof RNW?.postMessage === 'function') {
      RNW.postMessage(`'${bridgeEvent}'`);
      return;
    }
    if (window.parent === window) {
      return;
    }
    window.parent.postMessage(bridgeEvent, '*');
  };

  /**
   * Subscribes to window message events
   * @returns Cleanup function to unsubscribe
   */
  static subscribe = (listener: BridgeCoreListener): VoidFunction => {
    const browserListener = BridgeCore.browserListener(listener);
    if (typeof window === 'undefined' || !window.addEventListener) {
      return () => {};
    }
    window.addEventListener('message', browserListener);
    return () => window.removeEventListener('message', browserListener);
  };
}
