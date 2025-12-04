# API Reference

Complete API documentation for all Aspect packages.

## Table of Contents

- [@aspectly/core](#aspectcore)
- [@aspectly/web](#aspectweb)
- [@aspectly/react-native](#aspectreact-native)
- [@aspectly/react-native-web](#aspectreact-native-web)
- [Types](#types)

---

## @aspectly/core

The core package provides the bridge implementation for use inside iframes and WebViews.

### AspectlyBridge

The main class for creating a bridge instance inside embedded content.

```typescript
import { AspectlyBridge } from '@aspectly/core';

const bridge = new AspectlyBridge(options?: BridgeOptions);
```

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `100000` | Handler execution timeout in milliseconds |

#### Methods

##### `init(handlers?: BridgeHandlers): Promise<boolean>`

Initialize the bridge with handlers for incoming requests.

```typescript
await bridge.init({
  methodName: async (params) => {
    // Handle request
    return { result: 'value' };
  }
});
```

##### `send<T>(method: string, params?: object): Promise<T>`

Send a request to the host context.

```typescript
const result = await bridge.send<{ name: string }>('getUserData', { id: 123 });
```

##### `supports(method: string): boolean`

Check if a method is supported by the host.

##### `isAvailable(): boolean`

Check if the bridge is initialized and ready.

##### `subscribe(listener: BridgeListener): number`

Subscribe to all result events.

##### `unsubscribe(listener: BridgeListener): void`

Unsubscribe from result events.

##### `destroy(): void`

Cleanup bridge subscriptions.

---

## @aspectly/web

React hooks for embedding iframes in web applications.

### useAspectlyIframe

```typescript
import { useAspectlyIframe } from '@aspectly/web';

const [bridge, loaded, IframeComponent] = useAspectlyIframe({
  url: 'https://widget.example.com',
  timeout: 100000 // optional
});
```

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `url` | `string` | Yes | URL to load in the iframe |
| `timeout` | `number` | No | Handler execution timeout |

#### Returns

| Index | Type | Description |
|-------|------|-------------|
| 0 | `BridgeBase` | Bridge instance |
| 1 | `boolean` | Loading state |
| 2 | `FunctionComponent` | iframe component |

---

## @aspectly/react-native

React hooks for React Native WebView integration.

### useAspectlyWebView

```typescript
import { useAspectlyWebView } from '@aspectly/react-native';

const [bridge, loaded, WebViewComponent] = useAspectlyWebView({
  url: 'https://webapp.example.com',
  timeout: 100000 // optional
});
```

Same API as `@aspectly/web` but renders a WebView instead of iframe.

---

## @aspectly/react-native-web

Universal hooks for Expo and React Native Web apps.

### useAspectlyWebView

```typescript
import { useAspectlyWebView } from '@aspectly/react-native-web';
```

Same API, works on Web (iframe), iOS and Android (WebView).

---

## Types

### BridgeErrorType

```typescript
enum BridgeErrorType {
  METHOD_EXECUTION_TIMEOUT = 'METHOD_EXECUTION_TIMEOUT',
  UNSUPPORTED_METHOD = 'UNSUPPORTED_METHOD',
  REJECTED = 'REJECTED',
  BRIDGE_NOT_AVAILABLE = 'BRIDGE_NOT_AVAILABLE',
}
```

### BridgeHandlers

```typescript
interface BridgeHandlers {
  [key: string]: (params: object) => Promise<unknown>;
}
```

### BridgeResultError

```typescript
interface BridgeResultError {
  error_type: BridgeErrorType;
  error_message?: string;
}
```
