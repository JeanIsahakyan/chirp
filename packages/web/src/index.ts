// Main exports
export { useAspectlyIframe } from './useAspectIframe';

// Type exports
export type {
  UseAspectlyIframeOptions,
  UseAspectlyIframeReturn,
  AspectlyIframeProps,
} from './useAspectIframe';

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
