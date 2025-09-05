# API Reference

This document provides detailed information about all classes, methods, and types available in the Chirp framework.

## Table of Contents

- [ChirpBridge](#chirpbridge)
- [useChirpWebView](#usechirpwebview)
- [useChirpBrowserIframe](#usechirpbrowseriframe)
- [Types](#types)
- [Error Handling](#error-handling)

## ChirpBridge

The main bridge class for web applications that need to communicate with React Native WebViews or parent windows.

### Constructor

```tsx
const bridge = new ChirpBridge();
```

Creates a new bridge instance. The bridge automatically detects the environment and sets up the appropriate communication method.

### Methods

#### `init(handlers: BridgeHandlers): Promise<boolean>`

Initializes the bridge with message handlers and establishes communication with the other side.

**Parameters:**
- `handlers: BridgeHandlers` - Object containing method handlers

**Returns:** `Promise<boolean>` - Resolves to `true` when initialization is successful

**Example:**
```tsx
await bridge.init({
  getUserData: async (params) => {
    return { userId: 123, name: 'John Doe' };
  },
  showAlert: async (params) => {
    alert(params.message);
    return { success: true };
  }
});
```

#### `send(method: string, params: object): Promise<any>`

Sends a message to the other side and waits for a response.

**Parameters:**
- `method: string` - The method name to call
- `params: object` - Parameters to send with the message

**Returns:** `Promise<any>` - Resolves with the response data or rejects with an error

**Example:**
```tsx
try {
  const result = await bridge.send('getUserData', { userId: 123 });
  console.log('Response:', result);
} catch (error) {
  console.error('Error:', error);
}
```

#### `subscribe(listener: BridgeListener): number`

Subscribes to all bridge events for monitoring communication.

**Parameters:**
- `listener: BridgeListener` - Function to call when events occur

**Returns:** `number` - Subscription ID for unsubscribing

**Example:**
```tsx
const listener = (event) => {
  console.log('Bridge event:', event);
};
const subscriptionId = bridge.subscribe(listener);
```

#### `unsubscribe(listener: BridgeListener): void`

Unsubscribes from bridge events.

**Parameters:**
- `listener: BridgeListener` - The listener function to remove

**Example:**
```tsx
bridge.unsubscribe(listener);
```

#### `supports(method: string): boolean`

Checks if a method is supported by the other side.

**Parameters:**
- `method: string` - Method name to check

**Returns:** `boolean` - `true` if method is supported

**Example:**
```tsx
if (bridge.supports('getUserData')) {
  const userData = await bridge.send('getUserData', {});
}
```

#### `isAvailable(): boolean`

Checks if the bridge is ready for communication.

**Returns:** `boolean` - `true` if bridge is available

**Example:**
```tsx
if (bridge.isAvailable()) {
  // Safe to send messages
  await bridge.send('methodName', {});
}
```

## useChirpWebView

React Native hook for WebView communication.

### Signature

```tsx
const [bridge, loaded, Component] = useChirpWebView({
  webview_url: string
});
```

### Parameters

- `webview_url: string` - URL of the web content to load in the WebView

### Returns

- `bridge: BridgeBase` - Bridge instance for communication
- `loaded: boolean` - Whether the WebView has finished loading
- `Component: FunctionComponent<ComponentProps>` - WebView component to render

### Component Props

The returned component accepts these props:

- `onError?: (error: any) => void` - Error handler for WebView errors
- `style?: any` - Style object for the WebView

### Example

```tsx
import React, { useEffect } from 'react';
import { useChirpWebView } from '@jeanisahakyan/chirp';

function App() {
  const [bridge, loaded, WebViewComponent] = useChirpWebView({
    webview_url: 'https://example.com'
  });

  useEffect(() => {
    if (loaded) {
      bridge.init({
        handleMessage: async (params) => {
          return { received: true };
        }
      });
    }
  }, [loaded, bridge]);

  return (
    <WebViewComponent 
      style={{ flex: 1 }}
      onError={(error) => console.error('WebView error:', error)}
    />
  );
}
```

## useChirpBrowserIframe

Web hook for iframe communication. This is an alias for `useChirpWebView` that works in web browsers.

### Signature

```tsx
const [bridge, loaded, Component] = useChirpBrowserIframe({
  webview_url: string
});
```

### Parameters

- `webview_url: string` - URL of the content to load in the iframe

### Returns

- `bridge: BridgeBase` - Bridge instance for communication
- `loaded: boolean` - Whether the iframe has finished loading
- `Component: FunctionComponent<ComponentProps>` - Iframe component to render

### Component Props

The returned component accepts these props:

- `onError: (error: any) => void` - Error handler for iframe errors (required)
- `style?: any` - Style object for the iframe

### Example

```tsx
import React, { useEffect } from 'react';
import { useChirpWebView as useChirpBrowserIframe } from '@jeanisahakyan/chirp';

function ParentApp() {
  const [bridge, loaded, IframeComponent] = useChirpBrowserIframe({
    webview_url: 'https://example.com'
  });

  useEffect(() => {
    if (loaded) {
      bridge.init({
        handleIframeMessage: async (params) => {
          return { received: true };
        }
      });
    }
  }, [loaded, bridge]);

  return (
    <IframeComponent 
      style={{ width: '100%', height: '400px' }}
      onError={(error) => console.error('Iframe error:', error)}
    />
  );
}
```

## Types

### BridgeHandlers

Object containing method handlers for incoming messages.

```tsx
interface BridgeHandlers {
  [methodName: string]: BridgeHandler;
}
```

### BridgeHandler

Function type for handling incoming messages.

```tsx
type BridgeHandler = (params: object) => Promise<any>;
```

### BridgeListener

Function type for listening to bridge events.

```tsx
type BridgeListener = (result: BridgeResultEvent) => void;
```

### BridgeResultEvent

Event object passed to bridge listeners.

```tsx
interface BridgeResultEvent {
  type?: BridgeResultType;
  method?: string;
  request_id?: string;
  data?: BridgeResultData;
}
```

### BridgeResultType

Enum for result types.

```tsx
enum BridgeResultType {
  Success = 'Success',
  Error = 'Error'
}
```

### BridgeErrorType

Enum for error types.

```tsx
enum BridgeErrorType {
  METHOD_EXECUTION_TIMEOUT = 'METHOD_EXECUTION_TIMEOUT',
  UNSUPPORTED_METHOD = 'UNSUPPORTED_METHOD',
  REJECTED = 'REJECTED',
  BRIDGE_NOT_AVAILABLE = 'BRIDGE_NOT_AVAILABLE'
}
```

### BridgeResultError

Error object structure.

```tsx
interface BridgeResultError {
  error_type: BridgeErrorType;
  error_message?: string;
}
```

## Error Handling

The framework provides comprehensive error handling with specific error types:

### Error Types

- **`UNSUPPORTED_METHOD`**: The requested method is not registered on the other side
- **`METHOD_EXECUTION_TIMEOUT`**: The method execution exceeded the timeout (100 seconds)
- **`REJECTED`**: The handler function rejected with an error
- **`BRIDGE_NOT_AVAILABLE`**: The bridge is not ready for communication

### Error Handling Example

```tsx
try {
  const result = await bridge.send('methodName', params);
} catch (error) {
  switch (error.error_type) {
    case 'UNSUPPORTED_METHOD':
      console.log('Method not supported');
      break;
    case 'METHOD_EXECUTION_TIMEOUT':
      console.log('Request timed out');
      break;
    case 'BRIDGE_NOT_AVAILABLE':
      console.log('Bridge not ready');
      break;
    case 'REJECTED':
      console.log('Handler rejected:', error.error_message);
      break;
    default:
      console.log('Unknown error:', error);
  }
}
```

### Timeout Configuration

The framework has a built-in timeout of 100 seconds for method execution. If a handler takes longer than this, it will be rejected with a `METHOD_EXECUTION_TIMEOUT` error.

### Best Practices

1. **Always handle errors**: Use try-catch blocks when calling `bridge.send()`
2. **Check availability**: Use `bridge.isAvailable()` before sending messages
3. **Check method support**: Use `bridge.supports()` to verify method availability
4. **Handle initialization**: Wait for `bridge.init()` to complete before sending messages
5. **Clean up subscriptions**: Unsubscribe from events when components unmount
