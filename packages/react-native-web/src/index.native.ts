/**
 * Native platform exports - re-exports from @aspect/react-native
 *
 * This file is used by Metro bundler for iOS/Android builds.
 */
export {
  useChirpWebView,
  type UseChirpWebViewOptions,
  type UseChirpWebViewReturn,
  type ChirpWebViewProps,
} from '@aspect/react-native';

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
