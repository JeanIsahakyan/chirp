import type { BridgeHandlers, BridgeListener } from './types';
import type { BridgeInternal } from './BridgeInternal';

export class BridgeBase {
  private bridge: BridgeInternal;

  constructor(bridge: BridgeInternal) {
    this.bridge = bridge;
  }

  public supports = (method: string) => this.bridge.supports(method);

  public isAvailable = () => this.bridge.isAvailable();

  public send = (method: string, params: object): Promise<any> => {
    return this.bridge.send(method, params);
  };

  public subscribe = (listener: BridgeListener): number => {
    return this.bridge.subscribe(listener);
  };

  public unsubscribe(listener: BridgeListener) {
    return this.bridge.unsubscribe(listener);
  }

  public init = (handlers?: BridgeHandlers) => this.bridge.init(handlers);
}
