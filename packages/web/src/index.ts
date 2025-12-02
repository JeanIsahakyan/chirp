// Main exports
export { useChirpIframe } from './useChirpIframe';

// Type exports
export type {
  UseChirpIframeOptions,
  UseChirpIframeReturn,
  ChirpIframeProps,
} from './useChirpIframe';

// Re-export core types for convenience
export {
  ChirpBridge,
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
