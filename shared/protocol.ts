import { SimVarValue } from "./types";

export enum SharedCommandName {
    ACKNOWLEDGE = 'ack',

    REFUSED = 'ref',
}

export enum RemoteClientCommandName {
    LOGIN_AS_REMOTE_CLIENT = 'lac',

    SIMVAR_SUBSCRIBE = 'ssv',

    SIMVAR_SET = 'stv',

    COHERENT_SUBSCRIBE = 'ces',

    FLOW_SUBSCRIBE = 'fls',
}

export enum AircraftCommandName {
    LOGIN_AS_AIRCRAFT = 'laa',

    START_FRAME = 'ssf',

    END_FRAME = 'esf',

    SIMVAR_VALUES = 'svv',

    SIMVAR_SET_NOTIFY = 'stn',

    COHERENT_TRIGGERED = 'cet',

    FLOW_TRIGGERED = 'flt',
}

type Acknowledge = [command: SharedCommandName.ACKNOWLEDGE];

/**
 * Possible commands sent by the server
 */
export namespace RemoteClientCommands {
    export type LoginAsAceClient = [command: RemoteClientCommandName.LOGIN_AS_REMOTE_CLIENT];

    export type SimVarSubscribe = [command: RemoteClientCommandName.SIMVAR_SUBSCRIBE, name: string, unit: string, id: number];

    export type SimVarSet = [command: RemoteClientCommandName.SIMVAR_SET, requestId: number, name: string, unit: string, value: SimVarValue];

    export type CoherentSubscribe = [command: RemoteClientCommandName.COHERENT_SUBSCRIBE, event: string];

    export type FlowSubscribe = [command: RemoteClientCommandName.FLOW_SUBSCRIBE, event: string];

    export type All = Acknowledge | LoginAsAceClient | SimVarSubscribe | SimVarSet | CoherentSubscribe | FlowSubscribe;
}

/**
 * Possible commands sent by the client
 */
export namespace AircraftCommands {
    export type LoginAsAircraft = [command: AircraftCommandName.LOGIN_AS_AIRCRAFT];

    export type StartFrame = [command: AircraftCommandName.START_FRAME];

    export type EndFrame = [command: AircraftCommandName.END_FRAME];

    export type SimVarValues = [command: AircraftCommandName.SIMVAR_VALUES, ...parts: number[]];

    export type SimVarSetNotify = [command: AircraftCommandName.SIMVAR_SET_NOTIFY, requestId: number, rejected: 0 | 1];

    export type CoherentTriggered = [command: AircraftCommandName.COHERENT_TRIGGERED, event: string, ...args: string[]];

    export type FlowTriggered = [command: AircraftCommandName.FLOW_TRIGGERED, event: string, ...args: string[]];

    export type All = Acknowledge | LoginAsAircraft | StartFrame | EndFrame | SimVarValues | SimVarSetNotify | CoherentTriggered | FlowTriggered;
}
