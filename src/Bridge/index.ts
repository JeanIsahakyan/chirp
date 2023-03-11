import { BridgeCore } from './BridgeCore';
import { BridgeInternal } from './BridgeInternal';
import { BridgeBase } from './BridgeBase';

export class ChirpBridge extends BridgeBase {
  constructor() {
    const bridge = new BridgeInternal(BridgeCore.sendEvent);
    super(bridge);
    BridgeCore.subscribe(bridge.handleCoreEvent);
  }
}
