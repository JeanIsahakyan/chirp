# @jeanisahakyan/chirp

Chirp is a powerful communication bridge framework for React Native that enables seamless bidirectional communication between webviews, iframes, and web applications. It provides a unified API for handling complex messaging scenarios across different platforms and environments.

## 🎯 Goals

- **Universal Communication**: Enable communication between React Native WebViews, web iframes, and parent windows
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Cross-Platform**: Works on iOS, Android, and Web platforms
- **Promise-Based**: Modern async/await API for handling asynchronous operations
- **Error Handling**: Robust error handling with detailed error types
- **Event System**: Support for both request-response and event-driven communication patterns

## 📦 Installation

```sh
yarn add @jeanisahakyan/chirp
# or
npm install @jeanisahakyan/chirp
```

## 🚀 Quick Start

### React Native WebView Communication

```tsx
import React, { useEffect } from 'react';
import { useChirpWebView } from '@jeanisahakyan/chirp';

function App() {
  const [bridge, loaded, WebViewComponent] = useChirpWebView({
    webview_url: 'https://your-web-app.com'
  });

  useEffect(() => {
    if (loaded) {
      // Initialize bridge with handlers
      bridge.init({
        // Handle messages from webview
        getUserData: async (params) => {
          return { userId: 123, name: 'John Doe' };
        },
        showAlert: async (params) => {
          alert(params.message);
          return { success: true };
        }
      });
    }
  }, [loaded, bridge]);

  const sendToWebView = async () => {
    try {
      const result = await bridge.send('updateUI', { theme: 'dark' });
      console.log('WebView response:', result);
    } catch (error) {
      console.error('Communication failed:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Send to WebView" onPress={sendToWebView} />
      <WebViewComponent style={{ flex: 1 }} />
    </View>
  );
}
```

### Web Application (Inside WebView/Iframe)

```tsx
import { ChirpBridge } from '@jeanisahakyan/chirp';

// Initialize the bridge
const bridge = new ChirpBridge();

// Set up handlers for incoming messages
bridge.init({
  updateUI: async (params) => {
    document.body.style.backgroundColor = params.theme === 'dark' ? '#000' : '#fff';
    return { updated: true };
  }
});

// Send message to parent/React Native app
const sendToParent = async () => {
  try {
    const userData = await bridge.send('getUserData', {});
    console.log('User data:', userData);
  } catch (error) {
    console.error('Failed to get user data:', error);
  }
};
```

### Web Iframe Communication

```tsx
import { useChirpWebView as useChirpBrowserIframe } from '@jeanisahakyan/chirp';

function ParentApp() {
  const [bridge, loaded, IframeComponent] = useChirpBrowserIframe({
    webview_url: 'https://your-iframe-content.com'
  });

  // Same API as WebView communication
  useEffect(() => {
    if (loaded) {
      bridge.init({
        handleIframeMessage: async (params) => {
          console.log('Message from iframe:', params);
          return { received: true };
        }
      });
    }
  }, [loaded, bridge]);

  return <IframeComponent style={{ width: '100%', height: '400px' }} />;
}
```

## 🔧 API Reference

### ChirpBridge

The main bridge class for web applications.

#### Methods

- `init(handlers: BridgeHandlers): Promise<boolean>` - Initialize bridge with message handlers
- `send(method: string, params: object): Promise<any>` - Send message and wait for response
- `subscribe(listener: BridgeListener): number` - Subscribe to all bridge events
- `unsubscribe(listener: BridgeListener): void` - Unsubscribe from events
- `supports(method: string): boolean` - Check if method is supported
- `isAvailable(): boolean` - Check if bridge is ready for communication

### useChirpWebView Hook

React Native hook for WebView communication.

#### Parameters

- `webview_url: string` - URL of the web content to load

#### Returns

- `[bridge, loaded, Component]` - Bridge instance, loading state, and WebView component

### useChirpBrowserIframe Hook

Web hook for iframe communication (alias for `useChirpWebView`).

## 📋 Message Types

### Request-Response Pattern

```tsx
// Send a request and wait for response
const result = await bridge.send('methodName', { param1: 'value' });
```

### Event Subscription

```tsx
// Subscribe to all bridge events
const listener = (event) => {
  console.log('Bridge event:', event);
};
const subscriptionId = bridge.subscribe(listener);

// Unsubscribe when done
bridge.unsubscribe(listener);
```

## 🛠️ Error Handling

The framework provides detailed error types:

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
  }
}
```

## 🏗️ Architecture

Chirp uses a layered architecture:

1. **BridgeCore**: Handles low-level message serialization and platform-specific communication
2. **BridgeInternal**: Manages request/response lifecycle, error handling, and event routing
3. **BridgeBase**: Provides the public API interface
4. **ChirpBridge**: Main class that combines all components

The framework automatically detects the environment and uses the appropriate communication method:
- `ReactNativeWebView.postMessage()` for React Native WebViews
- `window.parent.postMessage()` for iframe communication
- `window.addEventListener('message')` for receiving messages

## 🔄 Message Flow

1. **Initialization**: Both sides call `bridge.init()` with their handlers
2. **Method Registration**: Handlers are registered and availability is synchronized
3. **Communication**: Messages are sent via `bridge.send()` and handled by registered handlers
4. **Response**: Handlers return promises that resolve to response data
5. **Error Handling**: Errors are caught and returned with detailed error information

## 📱 Platform Support

- ✅ **React Native iOS**: Full WebView support
- ✅ **React Native Android**: Full WebView support  
- ✅ **React Native Web**: Full iframe support
- ✅ **Web Browsers**: Full iframe and parent window communication

## 🤝 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 📄 License

MIT

---

