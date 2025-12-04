// Main exports
export { useAspectWebView } from './useAspectWebView';

// Type exports
export type {
  UseAspectWebViewOptions,
  UseAspectWebViewReturn,
  AspectWebViewProps,
} from './useAspectWebView';

// Re-export core types for convenience
export {
  AspectBridge,
  BridgeBase,
  BridgeErrorType,
  BridgeEventType,
  BridgeResultType,
} from '@aspect/core';

export type {
  BridgeHandler,
  BridgeHandlers,
  BridgeListener,
  BridgeOptions,
  BridgeResultError,
  BridgeResultEvent,
} from '@aspect/core';
