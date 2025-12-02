import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BridgeBase } from './BridgeBase';
import { BridgeInternal } from './BridgeInternal';

describe('BridgeBase', () => {
  let mockBridge: BridgeInternal;
  let bridgeBase: BridgeBase;

  beforeEach(() => {
    mockBridge = {
      supports: vi.fn().mockReturnValue(true),
      isAvailable: vi.fn().mockReturnValue(true),
      send: vi.fn().mockResolvedValue({ result: 'value' }),
      subscribe: vi.fn().mockReturnValue(1),
      unsubscribe: vi.fn(),
      init: vi.fn().mockResolvedValue(true),
    } as unknown as BridgeInternal;

    bridgeBase = new BridgeBase(mockBridge);
  });

  describe('supports', () => {
    it('should delegate to internal bridge', () => {
      bridgeBase.supports('testMethod');

      expect(mockBridge.supports).toHaveBeenCalledWith('testMethod');
    });

    it('should return the result from internal bridge', () => {
      (mockBridge.supports as ReturnType<typeof vi.fn>).mockReturnValue(false);

      expect(bridgeBase.supports('unknown')).toBe(false);
    });
  });

  describe('isAvailable', () => {
    it('should delegate to internal bridge', () => {
      bridgeBase.isAvailable();

      expect(mockBridge.isAvailable).toHaveBeenCalled();
    });

    it('should return the result from internal bridge', () => {
      (mockBridge.isAvailable as ReturnType<typeof vi.fn>).mockReturnValue(false);

      expect(bridgeBase.isAvailable()).toBe(false);
    });
  });

  describe('send', () => {
    it('should delegate to internal bridge with method and params', async () => {
      await bridgeBase.send('testMethod', { foo: 'bar' });

      expect(mockBridge.send).toHaveBeenCalledWith('testMethod', { foo: 'bar' });
    });

    it('should use empty object as default params', async () => {
      await bridgeBase.send('testMethod');

      expect(mockBridge.send).toHaveBeenCalledWith('testMethod', {});
    });

    it('should return the result from internal bridge', async () => {
      (mockBridge.send as ReturnType<typeof vi.fn>).mockResolvedValue({
        message: 'Hello',
      });

      const result = await bridgeBase.send<{ message: string }>('greet');

      expect(result).toEqual({ message: 'Hello' });
    });

    it('should propagate errors from internal bridge', async () => {
      const error = { error_type: 'REJECTED', error_message: 'Failed' };
      (mockBridge.send as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      await expect(bridgeBase.send('failing')).rejects.toEqual(error);
    });
  });

  describe('subscribe', () => {
    it('should delegate to internal bridge', () => {
      const listener = vi.fn();
      bridgeBase.subscribe(listener);

      expect(mockBridge.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should return subscription index', () => {
      (mockBridge.subscribe as ReturnType<typeof vi.fn>).mockReturnValue(5);

      const result = bridgeBase.subscribe(vi.fn());

      expect(result).toBe(5);
    });
  });

  describe('unsubscribe', () => {
    it('should delegate to internal bridge', () => {
      const listener = vi.fn();
      bridgeBase.unsubscribe(listener);

      expect(mockBridge.unsubscribe).toHaveBeenCalledWith(listener);
    });
  });

  describe('init', () => {
    it('should delegate to internal bridge with handlers', async () => {
      const handlers = {
        greet: async () => ({ message: 'hello' }),
      };

      await bridgeBase.init(handlers);

      expect(mockBridge.init).toHaveBeenCalledWith(handlers);
    });

    it('should work without handlers', async () => {
      await bridgeBase.init();

      expect(mockBridge.init).toHaveBeenCalledWith(undefined);
    });

    it('should return the result from internal bridge', async () => {
      (mockBridge.init as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      const result = await bridgeBase.init();

      expect(result).toBe(false);
    });
  });
});
