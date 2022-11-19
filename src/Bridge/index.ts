import { BridgeCore } from './BridgeCore';
import { BridgeInternal } from './BridgeInternal';
import { BridgeBase } from './BridgeBase';

class MainBridge extends BridgeBase {
  constructor() {
    const bridge = new BridgeInternal(BridgeCore.sendEvent);
    super(bridge);
    BridgeCore.subscribe(bridge.handleCoreEvent);
  }
}

export const chirpBridge = new MainBridge();
