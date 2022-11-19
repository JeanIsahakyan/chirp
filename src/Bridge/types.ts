export enum BridgeEventType {
  Request = 'Request',
  Result = 'Result',
  Init = 'Init',
  InitResult = 'InitResult',
}

export enum BridgeResultType {
  Success = 'Success',
  Error = 'Error',
}

export interface BridgeResultError {
  error_type: BridgeErrorType;
  error_message?: string;
}

export type BridgeResultSuccess = object;

export type BridgeResultData =
  | BridgeResultError
  | undefined
  | BridgeResultSuccess;

export interface BridgeResultEvent {
  type?: BridgeResultType;
  method?: string;
  request_id?: string;
  data?: BridgeResultData;
}

export interface BridgeRequestEvent {
  method: string;
  params: object;
  request_id?: string;
}

export interface BridgeInitEvent {
  methods: string[];
}

export type BridgeInitResultEvent = boolean;

export type BridgeData =
  | BridgeResultEvent
  | BridgeInitEvent
  | BridgeInitResultEvent
  | BridgeRequestEvent;

export interface BridgeEvent {
  type: BridgeEventType;
  data: BridgeData;
}

export enum BridgeErrorType {
  METHOD_EXECUTION_TIMEOUT = 'METHOD_EXECUTION_TIMEOUT',
  UNSUPPORTED_METHOD = 'UNSUPPORTED_METHOD',
  REJECTED = 'REJECTED',
  BRIDGE_NOT_AVAILABLE = 'BRIDGE_NOT_AVAILABLE',
}

export type BridgeHandler = (params: object) => Promise<any>;

export interface BridgeHandlers {
  [key: string]: BridgeHandler;
}

export type BridgeListener = (result: BridgeResultEvent) => void;
