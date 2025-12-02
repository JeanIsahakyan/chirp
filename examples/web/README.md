# @aspect/web Example

This example demonstrates using `@aspect/web` to embed an iframe and communicate with it.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start the widget (core example) server:

```bash
cd ../core
python -m http.server 3001
# or: npx serve . -l 3001
```

3. Start this example:

```bash
pnpm dev
```

4. Open http://localhost:3000

## What This Demonstrates

- Using `useChirpIframe` hook to embed an iframe
- Initializing handlers for messages from the iframe
- Sending messages to the iframe
- Subscribing to bridge events
- Two-way communication flow

## Project Structure

```
examples/web/
├── src/
│   ├── App.tsx      # Main application with bridge logic
│   ├── main.tsx     # React entry point
│   └── index.css    # Styles
├── index.html       # HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Bridge Methods

### Exposed by Parent (this app)

| Method | Description |
|--------|-------------|
| `parentGreet` | Responds to greetings from widget |
| `getUserData` | Returns mock user data |
| `showNotification` | Shows alert with notification |

### Called on Widget

| Method | Description |
|--------|-------------|
| `greet` | Send greeting to widget |
| `updateData` | Send data update |
| `setTheme` | Change widget theme |
