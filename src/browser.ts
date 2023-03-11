import { chirpBridge } from './Bridge';

declare global {
  interface Window {
    ReactNativeWebView?: any;
    chirpBridge: any;
  }
}

window.chirpBridge = chirpBridge;
