/**
 * Native platform exports - re-exports from @aspect/react-native
 *
 * This file is used by Metro bundler for iOS/Android builds.
 */
export {
  useAspectWebView,
  type UseAspectWebViewOptions,
  type UseAspectWebViewReturn,
  type AspectWebViewProps,
} from '@aspect/react-native';

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
