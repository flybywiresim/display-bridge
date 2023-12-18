interface BaseMessage {
  type: string;
  fromClientID: string;
}

export interface AircraftSigninMessage extends BaseMessage {
  type: 'aircraftSignin';
  clientName: string;
}

export interface AircraftStatusMessage extends BaseMessage {
  type: 'aircraftStatus';
  simUtcTime: number;
  simLocaltime: number;
  flightPlanInfo: {
    callsign: string;
    origin: string | null;
    dest: string | null;
    altn: string | null;
    progress: number;
  };
  airframe: {
    name: string;
    livery: string;
  };
  aircraftState: {
    heading: number;
    headingIsTrue: boolean;
    tas: number;
    altitude: number;
  };
}

export interface AircraftSendFileChunkMessage extends BaseMessage {
  type: 'aircraftSendFileChunk';
  requestID: string;
  data: string;
  chunkIndex: number;
  chunkCount: number;
  totalSizeBytes: number;
}

export interface AircraftSendInstrumentsMessage extends BaseMessage {
  type: 'aircraftSendInstruments';
  instruments: InstrumentMetadata[];
}

export interface AircraftSendSimVarValuesMessage extends BaseMessage {
  type: 'aircraftSendSimVarValues';
  values: [id: number, value: number][];
}

export interface AircraftSendDataStorageMessage extends BaseMessage {
  type: 'aircraftSendDataStorage';
  values: Record<string, string>;
}

export interface AircraftAsyncOperationResponseMessage extends BaseMessage {
  type: 'aircraftAsyncOperationResponse';
  requestID: string;
  successful: boolean;
  result: unknown;
}

export interface AircraftEventNotificationMessage extends BaseMessage {
  type: 'aircraftEventNotification';
  subscriptionID: string;
  data: unknown[];
}

export interface AircraftClientDisconnectMessage extends BaseMessage {
  type: 'aircraftClientDisconnect';
  clientID: string;
}

export interface RemoteSigninMessage extends BaseMessage {
  type: 'remoteSignin';
  clientName: string;
}

export interface RemoteRequestAircraftSigninMessage extends BaseMessage {
  type: 'remoteRequestAircraftSignin';
}

export interface RemoteDownloadFileMessage extends BaseMessage {
  type: 'remoteDownloadFile';
  fileVfsPath: string;
  requestID: string;
}

export interface RemoteEnumerateInstrumentsMessage extends BaseMessage {
  type: 'remoteEnumerateInstruments';
}

export interface RemoteSubscribeToSimVarMessage extends BaseMessage {
  type: 'remoteSubscribeToSimVar';
  simVarType: 'simVar' | 'globalVar';
  simVar: string;
  unit: string;
  id: number;
  subscriptionGroupID: string;
}

export interface RemoteRequestDataStorageMessage extends BaseMessage {
  type: 'remoteRequestDataStorage';
}

export interface RemoteSetDataStorageKeyMessage extends BaseMessage {
  type: 'remoteSetDataStorageKey';
  key: string;
  value: string;
}

export interface RemoteSetSimVarValueMessage extends BaseMessage {
  type: 'remoteSetSimVarValue';
  name: string;
  unit: string;
  value: unknown;
  requestID: string;
}

export interface PendingViewListenerOnCall {
  event: string;
  subscriptionID: string;
  subscriptionGroupID: string;
}

export interface RemoteRegisterViewListenerMessage extends BaseMessage {
  type: 'remoteRegisterViewListener';
  listenerName: string;
  listenerID: string;
  firstFrameCalls: PendingViewListenerOnCall[];
  requestID: string;
}

export interface RemoteViewListenerOnMessage extends BaseMessage {
  type: 'remoteViewListenerOn';
  listenerID: string;
  event: string;
  subscriptionID: string;
  subscriptionGroupID: string;
}

export interface RemoteSubscriptionCancelMessage extends BaseMessage {
  type: 'remoteSubscriptionCancel';
  subscriptionID: string;
}

export interface RemoteSubscriptionGroupCancelMessage extends BaseMessage {
  type: 'remoteSubscriptionGroupCancel';
  subscriptionGroupID: string;
}

export interface RemoteClientDisconnectMessage extends BaseMessage {
  type: 'remoteClientDisconnect';
  clientID: string;
}

export interface ProtocolGatewayIntroductionMessage extends BaseMessage {
  type: 'protocolGatewayIntroductionMessage';
  server: string;
  minProtocolVersion: number;
  maxProtocolVersion: number;
  heartbeatMinInterval: number;
  heartbeatMaxInterval: number;
  messageMaxSizeBytes: number;
}

export interface ProtocolErrorMessage extends BaseMessage {
  type: 'protocolError';
  id: number;
  message: string;
}

export interface ProtocolHeartbeat extends BaseMessage {
  type: 'protocolHeartbeat';
}

export type Messages =
  | AircraftSigninMessage
  | AircraftStatusMessage
  | AircraftSendFileChunkMessage
  | AircraftSendInstrumentsMessage
  | AircraftSendSimVarValuesMessage
  | AircraftSendDataStorageMessage
  | AircraftAsyncOperationResponseMessage
  | AircraftEventNotificationMessage
  | AircraftClientDisconnectMessage
  | RemoteSigninMessage
  | RemoteRequestAircraftSigninMessage
  | RemoteDownloadFileMessage
  | RemoteEnumerateInstrumentsMessage
  | RemoteSubscribeToSimVarMessage
  | RemoteRequestDataStorageMessage
  | RemoteSetDataStorageKeyMessage
  | RemoteSetSimVarValueMessage
  | RemoteRegisterViewListenerMessage
  | RemoteViewListenerOnMessage
  | RemoteSubscriptionCancelMessage
  | RemoteSubscriptionGroupCancelMessage
  | RemoteClientDisconnectMessage
  | ProtocolGatewayIntroductionMessage
  | ProtocolErrorMessage
  | ProtocolHeartbeat;

export interface GaugeMetadata {
  name: string;
  bundles: {
    js: string;
    css: string;
  };
}

export interface InstrumentMetadata {
  instrumentID: string;
  dimensions: {
    width: number;
    height: number;
  };
  gauges: GaugeMetadata[];
}
