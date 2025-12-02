# API Reference

Complete API documentation for all Chirp packages.

## Table of Contents

- [@aspect/core](#aspectcore)
- [@aspect/web](#aspectweb)
- [@aspect/react-native](#aspectreact-native)
- [@aspect/react-native-web](#aspectreact-native-web)
- [Types](#types)

---

## @aspect/core

The core package provides the bridge implementation for use inside iframes and WebViews.

### ChirpBridge

The main class for creating a bridge instance inside embedded content.

```typescript
import { ChirpBridge } from '@aspect/core';

const bridge = new ChirpBridge(options?: BridgeOptions);
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

## @aspect/web

React hooks for embedding iframes in web applications.

### useChirpIframe

```typescript
import { useChirpIframe } from '@aspect/web';

const [bridge, loaded, IframeComponent] = useChirpIframe({
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

## @aspect/react-native

React hooks for React Native WebView integration.

### useChirpWebView

```typescript
import { useChirpWebView } from '@aspect/react-native';

const [bridge, loaded, WebViewComponent] = useChirpWebView({
  url: 'https://webapp.example.com',
  timeout: 100000 // optional
});
```

Same API as `@aspect/web` but renders a WebView instead of iframe.

---

## @aspect/react-native-web

Universal hooks for Expo and React Native Web apps.

### useChirpWebView

```typescript
import { useChirpWebView } from '@aspect/react-native-web';
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
