// Main exports
export { useAspectlyIframe } from './useAspectlyIframe';

// Type exports
export type {
  UseAspectlyIframeOptions,
  UseAspectlyIframeReturn,
  AspectlyIframeProps,
} from './useAspectlyIframe';

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
