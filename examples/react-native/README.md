# React Native / React Native Web Example

This example demonstrates using `@aspect/react-native-web` for universal app development that works on iOS, Android, and Web.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start the widget server (from examples/core):

```bash
cd ../core
python -m http.server 3001
```

3. Start the Expo development server:

```bash
# For web
pnpm web

# For iOS
pnpm ios

# For Android
pnpm android
```

## Platform Behavior

| Platform | Rendering |
|----------|-----------|
| Web | Uses `<iframe>` |
| iOS | Uses `WKWebView` via react-native-webview |
| Android | Uses `WebView` via react-native-webview |

All platforms use the same API and React component!

## Widget URL Configuration

The example uses different URLs based on platform:

- **Web**: `http://localhost:3001`
- **Android Emulator**: `http://10.0.2.2:3001` (maps to host machine)
- **iOS Simulator**: Use your machine's IP address
- **Physical Device**: Use your machine's IP address on local network

## Project Structure

```
examples/react-native/
├── App.tsx           # Main application
├── app.json          # Expo configuration
├── babel.config.js   # Babel configuration
├── package.json
└── tsconfig.json
```

## Features Demonstrated

- Cross-platform WebView/iframe embedding
- Bridge initialization with handlers
- Sending messages to embedded content
- Receiving messages from embedded content
- Event logging
- Theme toggling

## Native Setup (Optional)

For running on physical iOS devices:

```bash
cd ios && pod install
```

For Android, no additional setup is required.
