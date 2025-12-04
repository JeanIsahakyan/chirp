# @aspectly/core Example

This example demonstrates using `@aspectly/core` via a browser script tag inside an iframe/WebView.

## Files

- `index.html` - A widget page that can be embedded in an iframe or WebView

## Usage

1. Serve this directory with any static file server:

```bash
# Using Python
python -m http.server 3001

# Using Node.js
npx serve .

# Using PHP
php -S localhost:3001
```

2. Open the web example (../web) which embeds this widget in an iframe.

## What This Demonstrates

- Using the global `window.aspectlyBridge` instance
- Initializing the bridge with handlers
- Sending messages to the parent container
- Receiving messages from the parent
- Event logging

## Bridge Methods (Exposed by Widget)

| Method | Description |
|--------|-------------|
| `greet` | Receives a greeting and responds |
| `updateData` | Receives data updates |
| `setTheme` | Changes the widget theme |

## Parent Methods (Called by Widget)

| Method | Description |
|--------|-------------|
| `parentGreet` | Send greeting to parent |
| `getUserData` | Request user data |
| `showNotification` | Display notification |
