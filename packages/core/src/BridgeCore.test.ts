import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BridgeCore } from './BridgeCore';

describe('BridgeCore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('wrapBridgeEvent', () => {
    it('should wrap an event in the bridge protocol format', () => {
      const event = { method: 'test', params: { foo: 'bar' } };
      const wrapped = BridgeCore.wrapBridgeEvent(event);

      expect(typeof wrapped).toBe('string');
      const parsed = JSON.parse(wrapped);
      expect(parsed.type).toBe('BridgeEvent');
      expect(parsed.event).toEqual(event);
    });

    it('should handle complex nested objects', () => {
      const event = {
        method: 'test',
        params: {
          nested: { deep: { value: 123 } },
          array: [1, 2, 3],
        },
      };
      const wrapped = BridgeCore.wrapBridgeEvent(event);
      const parsed = JSON.parse(wrapped);
      expect(parsed.event).toEqual(event);
    });
  });

  describe('wrapListener', () => {
    it('should parse valid bridge events', () => {
      const listener = vi.fn();
      const wrappedListener = BridgeCore.wrapListener(listener);
      const event = { method: 'test' };
      const data = JSON.stringify({ type: 'BridgeEvent', event });

      wrappedListener(data);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('should ignore non-string data', () => {
      const listener = vi.fn();
      const wrappedListener = BridgeCore.wrapListener(listener);

      wrappedListener(undefined);
      wrappedListener(123 as unknown as string);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should ignore empty strings', () => {
      const listener = vi.fn();
      const wrappedListener = BridgeCore.wrapListener(listener);

      wrappedListener('');

      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle iOS wrapped JSON (with single quotes)', () => {
      const listener = vi.fn();
      const wrappedListener = BridgeCore.wrapListener(listener);
      const event = { method: 'test' };
      const data = `'${JSON.stringify({ type: 'BridgeEvent', event })}'`;

      wrappedListener(data);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('should ignore non-JSON data', () => {
      const listener = vi.fn();
      const wrappedListener = BridgeCore.wrapListener(listener);

      wrappedListener('not json');
      wrappedListener('[1, 2, 3]');

      expect(listener).not.toHaveBeenCalled();
    });

    it('should ignore events with wrong type', () => {
      const listener = vi.fn();
      const wrappedListener = BridgeCore.wrapListener(listener);
      const data = JSON.stringify({ type: 'WrongType', event: {} });

      wrappedListener(data);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON gracefully', () => {
      const listener = vi.fn();
      const wrappedListener = BridgeCore.wrapListener(listener);

      wrappedListener('{invalid json}');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('browserListener', () => {
    it('should extract data from MessageEvent', () => {
      const listener = vi.fn();
      const browserListener = BridgeCore.browserListener(listener);
      const event = { method: 'test' };
      const messageEvent = {
        data: JSON.stringify({ type: 'BridgeEvent', event }),
      } as MessageEvent;

      browserListener(messageEvent);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('should ignore events without data', () => {
      const listener = vi.fn();
      const browserListener = BridgeCore.browserListener(listener);

      browserListener({ data: undefined } as MessageEvent);
      browserListener({} as MessageEvent);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('webViewListener', () => {
    it('should extract data from WebView nativeEvent', () => {
      const listener = vi.fn();
      const webViewListener = BridgeCore.webViewListener(listener);
      const event = { method: 'test' };
      const webViewMessage = {
        nativeEvent: {
          data: JSON.stringify({ type: 'BridgeEvent', event }),
        },
      };

      webViewListener(webViewMessage);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('should ignore messages without nativeEvent', () => {
      const listener = vi.fn();
      const webViewListener = BridgeCore.webViewListener(listener);

      webViewListener({});
      webViewListener({ nativeEvent: {} });
      webViewListener({ nativeEvent: { data: undefined } });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('sendEvent', () => {
    let originalParent: Window;
    let originalRNW: typeof window.ReactNativeWebView;

    beforeEach(() => {
      originalParent = window.parent;
      originalRNW = window.ReactNativeWebView;
    });

    afterEach(() => {
      Object.defineProperty(window, 'parent', {
        value: originalParent,
        writable: true,
        configurable: true,
      });
      (window as any).ReactNativeWebView = originalRNW;
    });

    it('should send to iframe parent when available', () => {
      (window as any).ReactNativeWebView = undefined;
      const mockParent = {
        postMessage: vi.fn(),
      };
      Object.defineProperty(window, 'parent', {
        value: mockParent,
        writable: true,
        configurable: true,
      });

      const event = { method: 'test' };
      BridgeCore.sendEvent(event);

      expect(mockParent.postMessage).toHaveBeenCalledWith(
        expect.any(String),
        '*'
      );
    });

    it('should send to ReactNativeWebView when available', () => {
      const mockRNW = {
        postMessage: vi.fn(),
      };
      (window as any).ReactNativeWebView = mockRNW;

      const event = { method: 'test' };
      BridgeCore.sendEvent(event);

      expect(mockRNW.postMessage).toHaveBeenCalledWith(expect.any(String));
    });

    it('should not send when window.parent === window (top level)', () => {
      (window as any).ReactNativeWebView = undefined;
      Object.defineProperty(window, 'parent', {
        value: window,
        writable: true,
        configurable: true,
      });

      const event = { method: 'test' };
      // This should not throw
      expect(() => BridgeCore.sendEvent(event)).not.toThrow();
    });
  });

  describe('subscribe', () => {
    it('should subscribe to message events', () => {
      const listener = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const unsubscribe = BridgeCore.subscribe(listener);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );
      expect(typeof unsubscribe).toBe('function');

      addEventListenerSpy.mockRestore();
    });

    it('should return cleanup function that removes listener', () => {
      const listener = vi.fn();
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const unsubscribe = BridgeCore.subscribe(listener);
      unsubscribe();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });
});
