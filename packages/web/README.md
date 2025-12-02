# @aspect/web

React hooks for embedding iframes and communicating with them using the Chirp bridge protocol.

## Installation

```bash
# npm
npm install @aspect/web

# pnpm
pnpm add @aspect/web

# yarn
yarn add @aspect/web
```

## Overview

`@aspect/web` provides React hooks for the parent page to embed iframes and establish bidirectional communication with them. The iframe content should use `@aspect/core` to communicate back.

## Quick Start

### Parent Page (Host)

```tsx
import { useChirpIframe } from '@aspect/web';

function App() {
  const [bridge, loaded, Iframe] = useChirpIframe({
    url: 'https://example.com/widget'
  });

  useEffect(() => {
    if (loaded) {
      // Initialize bridge with handlers
      bridge.init({
        getUser: async () => ({ name: 'John', id: 123 }),
        saveData: async (params) => {
          console.log('Saving:', params);
          return { success: true };
        }
      });
    }
  }, [loaded, bridge]);

  const handleSendMessage = async () => {
    try {
      const result = await bridge.send('greet', { name: 'World' });
      console.log('Response:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Parent App</h1>
      <Iframe style={{ width: '100%', height: 400 }} />
      <button onClick={handleSendMessage} disabled={!loaded}>
        Send Message
      </button>
    </div>
  );
}
```

### iframe Content (Widget)

The iframe should use `@aspect/core`:

```typescript
// Inside the iframe
import { ChirpBridge } from '@aspect/core';

const bridge = new ChirpBridge();

// Initialize with handlers
await bridge.init({
  greet: async (params: { name: string }) => {
    return { message: `Hello, ${params.name}!` };
  }
});

// Call parent methods
const user = await bridge.send('getUser');
console.log('User:', user);
```

## API Reference

### useChirpIframe

```typescript
const [bridge, loaded, IframeComponent] = useChirpIframe(options);
```

#### Options

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `url` | `string` | Yes | URL to load in the iframe |
| `timeout` | `number` | No | Handler execution timeout in ms (default: 100000) |

#### Returns

| Index | Type | Description |
|-------|------|-------------|
| 0 | `BridgeBase` | Bridge instance for communication |
| 1 | `boolean` | Whether the iframe has finished loading |
| 2 | `FunctionComponent` | React component to render the iframe |

### IframeComponent Props

The returned iframe component accepts all standard `<iframe>` HTML attributes plus:

| Prop | Type | Description |
|------|------|-------------|
| `style` | `CSSProperties` | Custom styles (border: 0 is applied by default) |
| `onError` | `(error: unknown) => void` | Optional error handler |

## Patterns

### Checking Method Support

```tsx
const handleAction = async () => {
  if (bridge.supports('advancedFeature')) {
    await bridge.send('advancedFeature', { data: 'value' });
  } else {
    // Fallback for older widget versions
    await bridge.send('basicFeature', { data: 'value' });
  }
};
```

### Subscribing to Events

```tsx
useEffect(() => {
  const handleEvent = (result) => {
    console.log('Bridge event:', result.method, result.data);
  };

  bridge.subscribe(handleEvent);

  return () => bridge.unsubscribe(handleEvent);
}, [bridge]);
```

### Error Handling

```tsx
import { BridgeErrorType } from '@aspect/web';

const handleSend = async () => {
  try {
    await bridge.send('action', { data: 'value' });
  } catch (error) {
    if (error.error_type === BridgeErrorType.BRIDGE_NOT_AVAILABLE) {
      console.log('Widget not ready yet');
    } else if (error.error_type === BridgeErrorType.UNSUPPORTED_METHOD) {
      console.log('Method not supported by widget');
    }
  }
};
```

## Security Considerations

- The bridge uses `postMessage` for communication
- By default, messages are sent with `'*'` origin - consider restricting this in production
- Always validate incoming data in your handlers
- Use HTTPS for iframe sources in production

## Related Packages

- [`@aspect/core`](../core) - Core bridge framework (used inside iframes)
- [`@aspect/react-native`](../react-native) - React Native WebView integration
- [`@aspect/react-native-web`](../react-native-web) - React Native Web + iframe support

## License

MIT
