import {
    AircraftCommandName,
    AircraftCommands,
    RemoteClientCommandName,
    RemoteClientCommands,
    SharedCommandName
} from "../../shared/protocol";
import { ClientGateway } from "./ClientGateway";

export enum ConnectionType {
    Aircraft,
    RemoteClient,
}

export class DisplayBridgeProxyServer {
    private connections = new Map<string, ConnectionType>();

    private aircraftClientID: string | null = null;

    constructor(
        private readonly clientGateway: ClientGateway,
    ) {
    }

    public processMessageFromClientRaw(clientID: string, message: string) {
        const parts = message.split(';');

        this.processMessageFromClient(clientID, parts as (AircraftCommands.All | RemoteClientCommands.All));
    }

    public removeClientConnection(clientID: string) {
        if (this.aircraftClientID === clientID) {
            this.aircraftClientID = null;
        }

        this.connections.delete(clientID);
    }

    private processMessageFromClient(clientID: string, parts: AircraftCommands.All | RemoteClientCommands.All) {
        const [command] = parts;

        const existing = this.connections.get(clientID);

        switch (command) {
            case AircraftCommandName.LOGIN_AS_AIRCRAFT: {
                if (existing) {
                    throw new Error('Client tried to login as Aircraft while already logged in as: ' + ConnectionType[existing]);
                }

                if (this.aircraftClientID) {
                    throw new Error('Two aircraft clients cannot log in');
                }

                this.connections.set(clientID, ConnectionType.Aircraft);

                this.aircraftClientID = clientID;

                this.sendMessageToAircraftClient(clientID, [SharedCommandName.ACKNOWLEDGE]);

                break;
            }
            case RemoteClientCommandName.LOGIN_AS_REMOTE_CLIENT: {
                if (existing) {
                    throw new Error('Client tried to login as RemoteClient while already logged in as: ' + ConnectionType[existing]);
                }

                this.connections.set(clientID, ConnectionType.RemoteClient);

                this.sendMessageToRemoteClient(clientID, [SharedCommandName.ACKNOWLEDGE]);

                break;
            }
            case AircraftCommandName.START_FRAME:
            case AircraftCommandName.END_FRAME:
            case AircraftCommandName.SIMVAR_VALUES:
            case AircraftCommandName.SIMVAR_SET_NOTIFY:
            case AircraftCommandName.COHERENT_TRIGGERED:
            case AircraftCommandName.FLOW_TRIGGERED:
                if (existing !== ConnectionType.Aircraft) {
                    throw new Error('Received Aircraft command from a client logged in as RemoteClient or not logged in');
                }
                this.processCommandFromAircraftClient(clientID, parts);
                break;
            case RemoteClientCommandName.SIMVAR_SUBSCRIBE:
            case RemoteClientCommandName.SIMVAR_SET:
            case RemoteClientCommandName.COHERENT_SUBSCRIBE:
            case RemoteClientCommandName.FLOW_SUBSCRIBE:
                if (existing !== ConnectionType.RemoteClient) {
                    throw new Error('Received RemoteClient command from a client logged in as Aircraft or not logged in');
                }
                this.processCommandFromRemoteClient(clientID, parts);
                break;
        }
    }

    private processCommandFromAircraftClient(clientID: string, command: AircraftCommands.All) {
        for (const [clientID, type] of this.connections.entries()) {
            if (type !== ConnectionType.RemoteClient) {
                continue;
            }

            const serialised = command.join(';');

            this.clientGateway.sendMessageRawTo(clientID, serialised);
        }
    }

    private processCommandFromRemoteClient(clientID: string, command: RemoteClientCommands.All) {
        // TODO maybe queue for sending ?
        if (this.aircraftClientID) {
            const serialised = command.join(';');

            this.clientGateway.sendMessageRawTo(this.aircraftClientID, serialised);
        } else {
            console.warn('RemoteClient #' + clientID + ' sent message, but no Aircraft client is connected');
        }
    }

    private sendMessageToAircraftClient(clientID: string, command: RemoteClientCommands.All) {
        const serialised = command.join(';');

        this.clientGateway.sendMessageRawTo(clientID, serialised);
    }

    private sendMessageToRemoteClient(clientID: string, command: AircraftCommands.All) {
        const serialised = command.join(';');

        this.clientGateway.sendMessageRawTo(clientID, serialised);
    }
}
