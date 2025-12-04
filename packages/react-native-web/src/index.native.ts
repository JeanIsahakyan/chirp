/**
 * Native platform exports - re-exports from @aspectly/react-native
 *
 * This file is used by Metro bundler for iOS/Android builds.
 */
export {
  useAspectlyWebView,
  type UseAspectlyWebViewOptions,
  type UseAspectlyWebViewReturn,
  type AspectlyWebViewProps,
} from '@aspectly/react-native';

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
