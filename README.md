# Chirp

A powerful, type-safe communication bridge framework for React Native, Web, and iframes.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Chirp enables seamless bidirectional communication between:
- **React Native apps** and **WebViews**
- **Web pages** and **iframes**
- **Universal apps** (React Native Web / Expo) and embedded content

## Packages

| Package | Description |
|---------|-------------|
| [`@aspect/core`](./packages/core) | Core bridge framework - use inside iframes/WebViews |
| [`@aspect/web`](./packages/web) | Web/iframe integration with React hooks |
| [`@aspect/react-native`](./packages/react-native) | React Native WebView integration |
| [`@aspect/react-native-web`](./packages/react-native-web) | Universal React Native Web support |

## Quick Start

### Scenario 1: Web page embedding an iframe

**Parent page (host):**

```tsx
import { useChirpIframe } from '@aspect/web';

function App() {
  const [bridge, loaded, Iframe] = useChirpIframe({
    url: 'https://widget.example.com'
  });

  useEffect(() => {
    if (loaded) {
      bridge.init({
        getUserData: async () => ({ name: 'John', id: 123 })
      });
    }
  }, [loaded]);

  return <Iframe style={{ width: '100%', height: 400 }} />;
}
```

**iframe content (widget):**

```typescript
import { ChirpBridge } from '@aspect/core';

const bridge = new ChirpBridge();
await bridge.init({
  greet: async (params) => ({ message: `Hello, ${params.name}!` })
});

const user = await bridge.send('getUserData');
```

### Scenario 2: React Native app with WebView

**React Native app:**

```tsx
import { useChirpWebView } from '@aspect/react-native';

function App() {
  const [bridge, loaded, WebView] = useChirpWebView({
    url: 'https://webapp.example.com'
  });

  useEffect(() => {
    if (loaded) {
      bridge.init({
        getDeviceInfo: async () => ({
          platform: Platform.OS,
          version: Platform.Version
        })
      });
    }
  }, [loaded]);

  return <WebView style={{ flex: 1 }} />;
}
```

**Web content (inside WebView):**

```typescript
import { ChirpBridge } from '@aspect/core';

const bridge = new ChirpBridge();
await bridge.init();

const device = await bridge.send('getDeviceInfo');
console.log(`Running on ${device.platform}`);
```

### Scenario 3: Universal app (Expo / React Native Web)

```tsx
import { useChirpWebView } from '@aspect/react-native-web';

// Same API works on iOS, Android, and Web!
function App() {
  const [bridge, loaded, WebView] = useChirpWebView({
    url: 'https://widget.example.com'
  });

  return <WebView style={{ flex: 1 }} />;
}
```

## Features

- **Type-safe** - Full TypeScript support with generics
- **Promise-based** - Modern async/await API
- **Universal** - Works on iOS, Android, and Web
- **Bidirectional** - Send and receive messages in both directions
- **Event-driven** - Subscribe to all bridge events
- **Error handling** - Typed errors with detailed messages
- **Timeout protection** - Configurable request timeouts

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Host Context                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ @aspect/web | @aspect/react-native | @aspect/react-native-web│ │
│  │                                                              │ │
│  │  • useChirpIframe() / useChirpWebView()                     │ │
│  │  • Register handlers                                         │ │
│  │  • Send requests                                             │ │
│  └──────────────────────────┬──────────────────────────────────┘ │
│                             │ postMessage / injectJavaScript     │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Embedded Context                           │ │
│  │                     (iframe/WebView)                         │ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │  @aspect/core                                          │  │ │
│  │  │                                                        │  │ │
│  │  │  • ChirpBridge                                        │  │ │
│  │  │  • Register handlers                                   │  │ │
│  │  │  • Send requests                                       │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

Choose the package based on your use case:

```bash
# Inside an iframe or WebView (embedded content)
npm install @aspect/core

# Web app embedding an iframe
npm install @aspect/web

# React Native app with WebView
npm install @aspect/react-native react-native-webview

# Universal app (Expo / React Native Web)
npm install @aspect/react-native-web react-native-webview
```

## Error Handling

```typescript
import { BridgeErrorType } from '@aspect/core';

try {
  const result = await bridge.send('someMethod', params);
} catch (error) {
  switch (error.error_type) {
    case BridgeErrorType.UNSUPPORTED_METHOD:
      console.log('Method not registered');
      break;
    case BridgeErrorType.METHOD_EXECUTION_TIMEOUT:
      console.log('Handler timed out');
      break;
    case BridgeErrorType.BRIDGE_NOT_AVAILABLE:
      console.log('Bridge not initialized');
      break;
    case BridgeErrorType.REJECTED:
      console.log('Handler threw error:', error.error_message);
      break;
  }
}
```

## Examples

See the [examples](./examples) directory:

- [`examples/core`](./examples/core) - Widget running inside iframe/WebView
- [`examples/web`](./examples/web) - React app embedding an iframe
- [`examples/react-native`](./examples/react-native) - Universal Expo app

## Documentation

- [API Reference](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Examples](./docs/EXAMPLES.md)
- [Migration Guide](./docs/MIGRATION.md)

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT © [Jean Isahakyan](https://github.com/JeanIsahakyan)
