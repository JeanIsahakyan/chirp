// Main exports
export { useAspectlyWebView } from './useAspectWebView';

// Type exports
export type {
  UseAspectlyWebViewOptions,
  UseAspectlyWebViewReturn,
  AspectlyWebViewProps,
} from './useAspectWebView';

// Re-export core types for convenience
export {
  AspectlyBridge,
  BridgeBase,
  BridgeErrorType,
  BridgeEventType,
  BridgeResultType,
} from '@aspectly/core';

export type {
  BridgeHandler,
  BridgeHandlers,
  BridgeListener,
  BridgeOptions,
  BridgeResultError,
  BridgeResultEvent,
} from '@aspectly/core';
