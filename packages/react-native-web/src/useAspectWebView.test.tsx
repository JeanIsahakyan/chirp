import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAspectWebView } from './useAspectWebView';

// Mock @aspect/core
vi.mock('@aspect/core', () => ({
  BridgeCore: {
    wrapBridgeEvent: vi.fn((event) => JSON.stringify({ type: 'BridgeEvent', event })),
    subscribe: vi.fn().mockReturnValue(vi.fn()),
  },
  BridgeInternal: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(true),
    send: vi.fn().mockResolvedValue({}),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    supports: vi.fn(),
    isAvailable: vi.fn(),
    handleCoreEvent: vi.fn(),
  })),
  BridgeBase: vi.fn().mockImplementation((internal) => ({
    init: internal.init,
    send: internal.send,
    subscribe: internal.subscribe,
    unsubscribe: internal.unsubscribe,
    supports: internal.supports,
    isAvailable: internal.isAvailable,
  })),
}));

describe('useAspectWebView (web platform)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hook return values', () => {
    it('should return bridge, loaded state, and component', () => {
      const { result } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const [bridge, loaded, WebViewComponent] = result.current;

      expect(bridge).toBeDefined();
      expect(typeof loaded).toBe('boolean');
      expect(typeof WebViewComponent).toBe('function');
    });

    it('should initially have loaded as false', () => {
      const { result } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const [, loaded] = result.current;
      expect(loaded).toBe(false);
    });
  });

  describe('bridge instance', () => {
    it('should have init method', () => {
      const { result } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const [bridge] = result.current;
      expect(typeof bridge.init).toBe('function');
    });

    it('should have send method', () => {
      const { result } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const [bridge] = result.current;
      expect(typeof bridge.send).toBe('function');
    });

    it('should have subscribe method', () => {
      const { result } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const [bridge] = result.current;
      expect(typeof bridge.subscribe).toBe('function');
    });

    it('should have unsubscribe method', () => {
      const { result } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const [bridge] = result.current;
      expect(typeof bridge.unsubscribe).toBe('function');
    });
  });

  describe('WebViewComponent', () => {
    it('should be a valid React component', () => {
      const { result } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const [, , WebViewComponent] = result.current;
      expect(WebViewComponent).toBeDefined();
    });
  });

  describe('memoization', () => {
    it('should return same bridge instance across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const firstBridge = result.current[0];
      rerender();
      const secondBridge = result.current[0];

      expect(firstBridge).toBe(secondBridge);
    });

    it('should return same component across re-renders with same url', () => {
      const { result, rerender } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com' })
      );

      const firstComponent = result.current[2];
      rerender();
      const secondComponent = result.current[2];

      expect(firstComponent).toBe(secondComponent);
    });
  });

  describe('options', () => {
    it('should accept timeout option', () => {
      const { result } = renderHook(() =>
        useAspectWebView({ url: 'https://example.com', timeout: 5000 })
      );

      expect(result.current).toBeDefined();
    });
  });
});
