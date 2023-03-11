import { ChirpBridge } from './Bridge';

declare global {
  interface Window {
    ReactNativeWebView?: any;
    chirpBridge: any;
  }
}

window.chirpBridge = new ChirpBridge();
