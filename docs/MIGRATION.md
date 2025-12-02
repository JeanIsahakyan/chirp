# Migration Guide

Guide for migrating from the legacy single-package `@jeanisahakyan/chirp` to the new multi-package architecture.

## Overview

The Chirp library has been restructured into a monorepo with multiple focused packages:

| Old | New | Use Case |
|-----|-----|----------|
| `@jeanisahakyan/chirp` | `@aspect/core` | Inside iframes/WebViews |
| `@jeanisahakyan/chirp` | `@aspect/web` | Web apps embedding iframes |
| `@jeanisahakyan/chirp` | `@aspect/react-native` | React Native apps |
| `@jeanisahakyan/chirp` | `@aspect/react-native-web` | Universal Expo apps |

## Step-by-Step Migration

### Step 1: Identify Your Use Case

**If you're building a widget/app that runs inside an iframe or WebView:**
→ Use `@aspect/core`

**If you're building a web app that embeds iframes:**
→ Use `@aspect/web`

**If you're building a React Native app that uses WebViews:**
→ Use `@aspect/react-native`

**If you're building a universal app (Expo/React Native Web):**
→ Use `@aspect/react-native-web`

### Step 2: Update Dependencies

```bash
# Remove old package
npm uninstall @jeanisahakyan/chirp

# Install new package based on use case
npm install @aspect/core          # For embedded content
npm install @aspect/web           # For web iframe hosts
npm install @aspect/react-native  # For React Native
```

### Step 3: Update Imports

#### For ChirpBridge (Inside WebView/iframe)

```diff
- import { ChirpBridge } from '@jeanisahakyan/chirp';
+ import { ChirpBridge } from '@aspect/core';

const bridge = new ChirpBridge();
```

#### For useChirpWebView (React Native)

```diff
- import { useChirpWebView } from '@jeanisahakyan/chirp';
+ import { useChirpWebView } from '@aspect/react-native';

function App() {
-  const [bridge, loaded, WebView] = useChirpWebView({
-    webview_url: 'https://example.com'
-  });
+  const [bridge, loaded, WebView] = useChirpWebView({
+    url: 'https://example.com'  // Note: 'webview_url' → 'url'
+  });
}
```

#### For useChirpBrowserIframe (Web)

```diff
- import { useChirpBrowserIframe } from '@jeanisahakyan/chirp';
+ import { useChirpIframe } from '@aspect/web';

function App() {
-  const [bridge, loaded, Iframe] = useChirpBrowserIframe({
-    webview_url: 'https://example.com'
-  });
+  const [bridge, loaded, Iframe] = useChirpIframe({
+    url: 'https://example.com'  // Note: 'webview_url' → 'url'
+  });
}
```

### Step 4: Update Options

The options object has been simplified:

```diff
// Old
const [bridge, loaded, Component] = useChirpWebView({
-  webview_url: 'https://example.com'
+  url: 'https://example.com'
});
```

### Step 5: Type Imports

Error types and other TypeScript types are now exported from each package:

```diff
- import { BridgeErrorType } from '@jeanisahakyan/chirp';
+ import { BridgeErrorType } from '@aspect/core';
// or from any other package
+ import { BridgeErrorType } from '@aspect/web';
```

## API Changes

### Hook Return Types

The hook return types remain the same:
- `bridge` - Bridge instance
- `loaded` - Loading state boolean
- `Component` - React component to render

### Options

| Old Property | New Property |
|--------------|--------------|
| `webview_url` | `url` |

### New Features

The new packages include additional features:

- **`timeout` option** - Configure handler execution timeout
- **`destroy()` method** - Clean up bridge subscriptions
- **Improved TypeScript generics** - Better type inference for `send<T>()`

## Package Comparison

### Bundle Sizes

The new packages are more modular, resulting in smaller bundle sizes when you only need specific functionality:

| Package | Approximate Size |
|---------|------------------|
| `@aspect/core` | ~4 KB |
| `@aspect/web` | ~2 KB (+ core) |
| `@aspect/react-native` | ~2 KB (+ core) |

### Dependencies

- `@aspect/core` - No dependencies
- `@aspect/web` - Depends on `@aspect/core`, peer dep on `react`
- `@aspect/react-native` - Depends on `@aspect/core`, peer deps on `react`, `react-native`, `react-native-webview`
- `@aspect/react-native-web` - Depends on all packages

## Troubleshooting

### "Cannot find module '@aspect/core'"

Make sure you've installed the correct package for your use case.

### "Property 'webview_url' does not exist"

The option has been renamed to `url`. Update your code:

```typescript
useChirpIframe({ url: 'https://...' })
```

### "Bridge methods not working"

Ensure both sides are using compatible versions of the packages. The protocol is backwards-compatible, but new features require updated packages on both sides.

## Support

If you encounter issues during migration:

1. Check the [API documentation](./API.md)
2. Review the [examples](./EXAMPLES.md)
3. Open an issue on [GitHub](https://github.com/JeanIsahakyan/chirp/issues)
