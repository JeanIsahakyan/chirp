import '@testing-library/jest-dom';

// Mock window.ReactNativeWebView for React Native WebView tests
Object.defineProperty(window, 'ReactNativeWebView', {
  value: undefined,
  writable: true,
});

// Mock postMessage
const originalPostMessage = window.postMessage;
window.postMessage = vi.fn((message, targetOrigin) => {
  // Trigger a message event for testing
  const event = new MessageEvent('message', {
    data: message,
    origin: targetOrigin === '*' ? window.location.origin : targetOrigin,
  });
  window.dispatchEvent(event);
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});
