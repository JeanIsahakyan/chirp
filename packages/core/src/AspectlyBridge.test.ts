import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AspectlyBridge } from './AspectlyBridge';
import { BridgeCore } from './BridgeCore';

// Mock BridgeCore
vi.mock('./BridgeCore', () => ({
  BridgeCore: {
    sendEvent: vi.fn(),
    subscribe: vi.fn().mockReturnValue(vi.fn()),
  },
}));

describe('AspectlyBridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a bridge and subscribe to events', () => {
      const bridge = new AspectlyBridge();

      expect(BridgeCore.subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(bridge).toBeInstanceOf(AspectlyBridge);
    });

    it('should pass options to internal bridge', () => {
      const bridge = new AspectlyBridge({ timeout: 5000 });

      expect(bridge).toBeInstanceOf(AspectlyBridge);
    });
  });

  describe('destroy', () => {
    it('should call unsubscribe function', () => {
      const unsubscribeMock = vi.fn();
      (BridgeCore.subscribe as ReturnType<typeof vi.fn>).mockReturnValue(
        unsubscribeMock
      );

      const bridge = new AspectlyBridge();
      bridge.destroy();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });

  describe('inherited methods', () => {
    it('should have init method', () => {
      const bridge = new AspectlyBridge();
      expect(typeof bridge.init).toBe('function');
    });

    it('should have send method', () => {
      const bridge = new AspectlyBridge();
      expect(typeof bridge.send).toBe('function');
    });

    it('should have subscribe method', () => {
      const bridge = new AspectlyBridge();
      expect(typeof bridge.subscribe).toBe('function');
    });

    it('should have unsubscribe method', () => {
      const bridge = new AspectlyBridge();
      expect(typeof bridge.unsubscribe).toBe('function');
    });

    it('should have supports method', () => {
      const bridge = new AspectlyBridge();
      expect(typeof bridge.supports).toBe('function');
    });

    it('should have isAvailable method', () => {
      const bridge = new AspectlyBridge();
      expect(typeof bridge.isAvailable).toBe('function');
    });
  });
});
