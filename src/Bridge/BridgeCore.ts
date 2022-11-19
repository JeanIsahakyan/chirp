const RNW = (window as any).ReactNativeWebView;
const isReactNativeWebView = RNW && typeof RNW.postMessage === 'function';

export type Event = any;

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

export class BridgeCore {
  private static BRIDGE_EVENT_TYPE = 'BridgeEvent';

  private static isJSONObject = (str: string) =>
    str.startsWith('{') && str.endsWith('}');

  public static wrapBridgeEvent = (event: Event): string =>
    JSON.stringify({
      event,
      type: BridgeCore.BRIDGE_EVENT_TYPE,
    });

  static wrapListener = (listener: BridgeCoreListener) => (data?: string) => {
    if (typeof data !== 'string') {
      return;
    }
    if (!data) {
      return;
    }
    if (!BridgeCore.isJSONObject(data)) {
      // We need object for handling
      return;
    }
    try {
      const eventData: BridgeCoreEvent = JSON.parse(data);
      if (!eventData || eventData.type !== BridgeCore.BRIDGE_EVENT_TYPE) {
        return;
      }
      return listener(eventData.event);
    } catch (e) {}
  };

  static browserListener = (listener: BridgeCoreListener) => {
    const triggerEvent = BridgeCore.wrapListener(listener);
    return (originalEvent: MessageEvent) => {
      if (!originalEvent || !originalEvent?.data) {
        return;
      }
      return triggerEvent(originalEvent.data);
    };
  };

  static webViewListener = (listener: BridgeCoreListener) => {
    const triggerEvent = BridgeCore.wrapListener(listener);
    return (originalEvent: WebViewMessage) => {
      if (!originalEvent || !originalEvent?.nativeEvent?.data) {
        return;
      }
      return triggerEvent(originalEvent.nativeEvent?.data);
    };
  };

  static sendEvent = (event: Event): void => {
    const bridgeEvent = BridgeCore.wrapBridgeEvent(event);
    if (isReactNativeWebView) {
      return RNW.postMessage(bridgeEvent, '*');
    }
    if (window.parent === window) {
      return;
    }
    return window.parent.postMessage(bridgeEvent, '*');
  };

  static subscribe = (listener: BridgeCoreListener): VoidFunction => {
    const browserListener = BridgeCore.browserListener(listener);
    if (!window || !window.addEventListener) {
      return () => {};
    }
    window.addEventListener('message', browserListener);
    return () => window.removeEventListener('message', browserListener);
  };
}
