import {
  BridgeData,
  BridgeErrorType,
  BridgeEvent,
  BridgeEventType,
  BridgeHandlers,
  BridgeInitEvent,
  BridgeInitResultEvent,
  BridgeListener,
  BridgeRequestEvent,
  BridgeResultData,
  BridgeResultError,
  BridgeResultEvent,
  BridgeResultSuccess,
  BridgeResultType,
} from './types';

export const internalEvent = (
  type: BridgeEventType,
  data: BridgeData
): BridgeEvent => ({
  type,
  data,
});

export const internalResultEvent = (data: BridgeData) =>
  internalEvent(BridgeEventType.Result, data);

interface InternalRequestPromise {
  reject: (error: BridgeResultError) => void;
  resolve: (result: BridgeResultData) => void;
}

interface InitPromise {
  reject: () => void;
  resolve: (success: boolean) => void;
}
type InternalEventSender = (event: BridgeEvent) => void;

export class BridgeInternal {
  private requests: InternalRequestPromise[] = [];
  private handlers: BridgeHandlers = {};
  private available: boolean = false;
  private supportedMethods: string[] = [];
  private listeners: BridgeListener[] = [];
  private initPromise?: InitPromise;
  private readonly sendEvent: InternalEventSender = () => {};

  constructor(sendEvent: InternalEventSender) {
    this.sendEvent = sendEvent;
  }

  public subscribe = (listener: BridgeListener): number => {
    return this.listeners.push(listener);
  };

  public unsubscribe = (listener: BridgeListener) => {
    this.listeners = this.listeners.filter(
      (oldListener) => oldListener !== listener
    );
  };

  private checkDiff = (a: string[], b: string[]): boolean => {
    return (
      a.filter((x) => !b.includes(x)).length > 0 ||
      b.filter((x) => !a.includes(x)).length > 0
    );
  };

  public init = (handlers: BridgeHandlers = {}) => {
    const oldMethods = Object.keys(this.handlers);
    const newMethods = Object.keys(handlers);
    this.handlers = handlers;
    if (!this.checkDiff(oldMethods, newMethods)) {
      return Promise.resolve(true);
    }
    return new Promise((resolve, reject) => {
      this.initPromise = { resolve, reject };
      this.sendEvent(
        internalEvent(BridgeEventType.Init, {
          methods: newMethods,
        })
      );
    });
  };

  public handleCoreEvent = (event: BridgeEvent) => {
    const { type, data } = event;
    if (type === BridgeEventType.Init) {
      this.handleInit(data as BridgeInitEvent);
      return;
    }
    if (type === BridgeEventType.InitResult) {
      this.handleInitResult(data as BridgeInitResultEvent);
      return;
    }
    if (type === BridgeEventType.Request) {
      this.handleRequest(data as BridgeRequestEvent);
      return;
    }
    if (type === BridgeEventType.Result) {
      this.handleResult(data as BridgeResultEvent);
      return;
    }
  };

  public handleRequest = (request: BridgeRequestEvent) => {
    const { method, params, request_id } = request;
    new Promise<BridgeEvent>((resolve, reject) => {
      let timeout = false;
      if (!this.handlers.hasOwnProperty(method)) {
        reject({
          error_type: BridgeErrorType.UNSUPPORTED_METHOD,
          error: Error(`Handler for "${method}" is not registered`),
        });
        return;
      }
      const timer = setTimeout(() => {
        timeout = true;
        reject({
          error_type: BridgeErrorType.METHOD_EXECUTION_TIMEOUT,
          error: Error('Execution timeout exceeded'),
        });
      }, 100000);
      const handler = this.handlers[method];
      if (!handler) {
        reject({
          error_type: BridgeErrorType.UNSUPPORTED_METHOD,
          error: Error(`Handler for "${method}" is undefined`),
        });
        return;
      }
      handler(params)
        .then((result) => {
          if (timeout) {
            return;
          }
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error: Error) => {
          if (timeout) {
            return;
          }
          clearTimeout(timer);
          reject({
            error_type: BridgeErrorType.REJECTED,
            error: error,
          });
        });
    })
      .then((data: BridgeResultSuccess) => {
        this.sendEvent(
          internalResultEvent({
            type: BridgeResultType.Success,
            data,
            method,
            request_id,
          })
        );
      })
      .catch(
        ({
          error_type,
          error,
        }: {
          error_type: BridgeErrorType;
          error: Error;
        }) => {
          this.sendEvent(
            internalResultEvent({
              type: BridgeResultType.Error,
              request_id,
              method,
              data: {
                error_message: error.message,
                error_type,
              },
            })
          );
        }
      );
  };

  private handleResult = (result: BridgeResultEvent) => {
    this.handleRequestResult(result);
    this.listeners.forEach((listener) => listener(result));
  };

  private handleRequestResult = (result: BridgeResultEvent) => {
    if (!result || !result.hasOwnProperty('request_id')) {
      return;
    }
    if (!result.hasOwnProperty('type')) {
      console.warn('unknown result', result);
      return;
    }
    const { request_id, data, type } = result;
    const request = this.requests[Number(request_id)];
    if (!request) {
      return;
    }
    if (type === BridgeResultType.Success) {
      request.resolve(data);
      return;
    }
    if (type === BridgeResultType.Error) {
      request.reject(data as BridgeResultError);
      return;
    }
  };

  private handleInit = (data: BridgeInitEvent) => {
    this.available = true;
    this.supportedMethods = data.methods!;
    this.sendEvent(internalEvent(BridgeEventType.InitResult, true));
  };

  private handleInitResult = (success: BridgeInitResultEvent) => {
    if (success) {
      this.initPromise?.resolve(true);
    } else {
      this.initPromise?.reject();
    }
  };

  public send = (method: string, params: object): Promise<any> =>
    new Promise((resolve, reject) => {
      const request_id = (
        this.requests.push({ resolve, reject }) - 1
      ).toString();
      if (!this.isAvailable()) {
        return this.handleCoreEvent(
          internalResultEvent({
            type: BridgeResultType.Error,
            request_id,
            method,
            data: {
              error_message: 'Bridge is not available',
              error_type: BridgeErrorType.BRIDGE_NOT_AVAILABLE,
            },
          })
        );
      }
      this.sendEvent(
        internalEvent(BridgeEventType.Request, {
          method,
          params,
          request_id,
        })
      );
    });

  public supports = (method: string) => this.supportedMethods.includes(method);
  public isAvailable = () => this.available;
}
