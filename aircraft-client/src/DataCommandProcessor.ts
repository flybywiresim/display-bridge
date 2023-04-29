import { AircraftDataConsumer } from "./AircraftDataConsumer";
import { AircraftClient } from "./AircraftClient";
import { AircraftCommandName } from "../../shared/protocol";

export class DataCommandProcessor {
    constructor(
        private readonly aircraftClient: AircraftClient,
        private readonly dataConsumer: AircraftDataConsumer,
    ) {
    }

    public processSubscribeToSimVarCommand(remoteClientID: string, parts: readonly string[]): void {
        const name = parts[0];
        const unit = parts[1];

        const id = parts[2];
        const intId = parseInt(id);

        if (!Number.isFinite(intId)) {
            throw new Error('Processed simvar id with non-number value');
        }

        let subMap = this.aircraftClient.simVarSubscriptions.get(remoteClientID);

        if (!subMap) {
            subMap = new Map<number, [string, string]>();

            this.aircraftClient.simVarSubscriptions.set(remoteClientID, subMap);
        }

        console.log(`[AircraftClient] SimVar subscribed: (${name}, ${unit}) id=${intId}`)

        subMap.set(intId, [name, unit]);
    }

    public processSetSimVarValueCommand(remoteClientID: string, parts: readonly string[]): void {
        const requestId = parts[0];
        const intRequestId = parseInt(requestId);

        const name = parts[1];
        const unit = parts[2];

        const value = parts[3];
        const floatValue = parseFloat(value);

        this.dataConsumer.setSimVarValue(name, unit, floatValue).then(() => {
            this.aircraftClient.sendMessage([AircraftCommandName.SIMVAR_SET_NOTIFY, intRequestId, 0]);
        }).catch(() => {
            this.aircraftClient.sendMessage([AircraftCommandName.SIMVAR_SET_NOTIFY, intRequestId, 1]);
        });
    }

    public processCoherentSubscribeCommand(remoteClientID: string, parts: readonly string[]): void {
        const requestId = parts[0];
        const intRequestId = parseInt(requestId);

        const eventName = parts[1];

        this.dataConsumer.subscribeToCoherentEvent(eventName, intRequestId);
    }

    public processCoherentUnsubscribeCommand(remoteClientID: string, parts: readonly string[]): void {
        const requestId = parts[0];
        const intRequestId = parseInt(requestId);

        this.dataConsumer.unsubscribeToCoherentEvent(intRequestId);
    }
}
