import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BridgeInternal } from './BridgeInternal';
import { BridgeEventType, BridgeResultType, BridgeErrorType } from './types';

describe('BridgeInternal', () => {
  let sendEvent: ReturnType<typeof vi.fn>;
  let bridge: BridgeInternal;

  beforeEach(() => {
    sendEvent = vi.fn();
    bridge = new BridgeInternal(sendEvent);
  });

  describe('init', () => {
    it('should send Init event with methods', () => {
      const handlers = {
        greet: async () => ({ message: 'hello' }),
        getData: async () => ({ data: 'value' }),
      };

      bridge.init(handlers);

      expect(sendEvent).toHaveBeenCalledWith({
        type: BridgeEventType.Init,
        data: {
          methods: ['greet', 'getData'],
        },
      });
    });

    it('should not send Init if methods are the same', async () => {
      const handlers = {
        greet: async () => ({ message: 'hello' }),
      };

      // First init
      bridge.init(handlers);
      expect(sendEvent).toHaveBeenCalledTimes(1);

      // Second init with same handlers
      sendEvent.mockClear();
      const result = await bridge.init(handlers);

      expect(result).toBe(true);
      expect(sendEvent).not.toHaveBeenCalled();
    });

    it('should return promise that resolves on InitResult', async () => {
      const handlers = {
        greet: async () => ({ message: 'hello' }),
      };

      const initPromise = bridge.init(handlers);

      // Simulate receiving InitResult
      bridge.handleCoreEvent({
        type: BridgeEventType.InitResult,
        data: true,
      });

      await expect(initPromise).resolves.toBe(true);
    });
  });

  describe('handleCoreEvent', () => {
    it('should handle Init event and send InitResult', () => {
      bridge.handleCoreEvent({
        type: BridgeEventType.Init,
        data: { methods: ['test'] },
      });

      expect(sendEvent).toHaveBeenCalledWith({
        type: BridgeEventType.InitResult,
        data: true,
      });
      expect(bridge.isAvailable()).toBe(true);
      expect(bridge.supports('test')).toBe(true);
    });

    it('should handle Request event and call handler', async () => {
      const handler = vi.fn().mockResolvedValue({ success: true });
      await bridge.init({ greet: handler });

      bridge.handleCoreEvent({
        type: BridgeEventType.Request,
        data: {
          method: 'greet',
          params: { name: 'John' },
          request_id: '1',
        },
      });

      // Wait for async handler
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(handler).toHaveBeenCalledWith({ name: 'John' });
    });

    it('should send success result after handler completes', async () => {
      const handler = vi.fn().mockResolvedValue({ message: 'Hello!' });
      await bridge.init({ greet: handler });

      bridge.handleCoreEvent({
        type: BridgeEventType.Request,
        data: {
          method: 'greet',
          params: {},
          request_id: '1',
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(sendEvent).toHaveBeenCalledWith({
        type: BridgeEventType.Result,
        data: {
          type: BridgeResultType.Success,
          data: { message: 'Hello!' },
          method: 'greet',
          request_id: '1',
        },
      });
    });

    it('should send error result for unsupported methods', async () => {
      bridge.handleCoreEvent({
        type: BridgeEventType.Request,
        data: {
          method: 'unknownMethod',
          params: {},
          request_id: '1',
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(sendEvent).toHaveBeenCalledWith({
        type: BridgeEventType.Result,
        data: {
          type: BridgeResultType.Error,
          request_id: '1',
          method: 'unknownMethod',
          data: {
            error_message: expect.any(String),
            error_type: BridgeErrorType.UNSUPPORTED_METHOD,
          },
        },
      });
    });

    it('should send error result when handler throws', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Handler error'));
      await bridge.init({ failing: handler });

      bridge.handleCoreEvent({
        type: BridgeEventType.Request,
        data: {
          method: 'failing',
          params: {},
          request_id: '1',
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(sendEvent).toHaveBeenCalledWith({
        type: BridgeEventType.Result,
        data: {
          type: BridgeResultType.Error,
          request_id: '1',
          method: 'failing',
          data: {
            error_message: 'Handler error',
            error_type: BridgeErrorType.REJECTED,
          },
        },
      });
    });
  });

  describe('send', () => {
    beforeEach(() => {
      // Initialize bridge
      bridge.handleCoreEvent({
        type: BridgeEventType.Init,
        data: { methods: ['test'] },
      });
    });

    it('should send request event', () => {
      bridge.send('test', { foo: 'bar' });

      expect(sendEvent).toHaveBeenCalledWith({
        type: BridgeEventType.Request,
        data: {
          method: 'test',
          params: { foo: 'bar' },
          request_id: expect.any(String),
        },
      });
    });

    it('should resolve promise on success result', async () => {
      const promise = bridge.send<{ message: string }>('test', {});

      // Simulate result
      bridge.handleCoreEvent({
        type: BridgeEventType.Result,
        data: {
          type: BridgeResultType.Success,
          data: { message: 'success' },
          request_id: '0',
          method: 'test',
        },
      });

      await expect(promise).resolves.toEqual({ message: 'success' });
    });

    it('should reject promise on error result', async () => {
      const promise = bridge.send('test', {});

      bridge.handleCoreEvent({
        type: BridgeEventType.Result,
        data: {
          type: BridgeResultType.Error,
          data: {
            error_type: BridgeErrorType.REJECTED,
            error_message: 'Failed',
          },
          request_id: '0',
          method: 'test',
        },
      });

      await expect(promise).rejects.toEqual({
        error_type: BridgeErrorType.REJECTED,
        error_message: 'Failed',
      });
    });

    it('should reject with BRIDGE_NOT_AVAILABLE when not initialized', async () => {
      const uninitializedBridge = new BridgeInternal(sendEvent);
      const promise = uninitializedBridge.send('test', {});

      await expect(promise).rejects.toEqual({
        error_type: BridgeErrorType.BRIDGE_NOT_AVAILABLE,
        error_message: 'Bridge is not available',
      });
    });
  });

  describe('subscribe/unsubscribe', () => {
    it('should notify listeners on result events', () => {
      const listener = vi.fn();
      bridge.subscribe(listener);

      bridge.handleCoreEvent({
        type: BridgeEventType.Result,
        data: {
          type: BridgeResultType.Success,
          data: { foo: 'bar' },
          method: 'test',
        },
      });

      expect(listener).toHaveBeenCalledWith({
        type: BridgeResultType.Success,
        data: { foo: 'bar' },
        method: 'test',
      });
    });

    it('should stop notifying after unsubscribe', () => {
      const listener = vi.fn();
      bridge.subscribe(listener);
      bridge.unsubscribe(listener);

      bridge.handleCoreEvent({
        type: BridgeEventType.Result,
        data: {
          type: BridgeResultType.Success,
          data: {},
          method: 'test',
        },
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('supports', () => {
    it('should return false before initialization', () => {
      expect(bridge.supports('test')).toBe(false);
    });

    it('should return true for supported methods after init', () => {
      bridge.handleCoreEvent({
        type: BridgeEventType.Init,
        data: { methods: ['greet', 'getData'] },
      });

      expect(bridge.supports('greet')).toBe(true);
      expect(bridge.supports('getData')).toBe(true);
      expect(bridge.supports('unknown')).toBe(false);
    });
  });

  describe('isAvailable', () => {
    it('should return false before initialization', () => {
      expect(bridge.isAvailable()).toBe(false);
    });

    it('should return true after Init event', () => {
      bridge.handleCoreEvent({
        type: BridgeEventType.Init,
        data: { methods: [] },
      });

      expect(bridge.isAvailable()).toBe(true);
    });
  });

  describe('timeout', () => {
    it('should use custom timeout from options', async () => {
      vi.useFakeTimers();

      const customBridge = new BridgeInternal(sendEvent, { timeout: 100 });
      const slowHandler = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 200))
      );
      await customBridge.init({ slow: slowHandler });

      customBridge.handleCoreEvent({
        type: BridgeEventType.Request,
        data: {
          method: 'slow',
          params: {},
          request_id: '1',
        },
      });

      vi.advanceTimersByTime(150);

      expect(sendEvent).toHaveBeenCalledWith({
        type: BridgeEventType.Result,
        data: {
          type: BridgeResultType.Error,
          request_id: '1',
          method: 'slow',
          data: {
            error_message: 'Execution timeout exceeded',
            error_type: BridgeErrorType.METHOD_EXECUTION_TIMEOUT,
          },
        },
      });

      vi.useRealTimers();
    });
  });
});
