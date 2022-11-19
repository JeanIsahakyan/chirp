import { chirpBridge } from './Bridge';

declare global {
  interface Window {
    chirpBridge: typeof chirpBridge;
  }
}

window.chirpBridge = chirpBridge;
