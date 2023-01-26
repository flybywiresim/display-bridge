import { AircraftDataConsumer } from "./AircraftDataConsumer";
import { AircraftClient } from "./AircraftClient";
import { AircraftCommandName } from "../../shared/protocol";

export class DataCommandProcessor {
    constructor(
        private readonly aircraftClient: AircraftClient,
        private readonly dataConsumer: AircraftDataConsumer,
    ) {
    }

    public processSubscribeToSimVarCommand(parts: readonly string[]): void {
        const name = parts[0];
        const unit = parts[1];

        const id = parts[2];
        const intId = parseInt(id);

        if (!Number.isFinite(intId)) {
            throw new Error('Processed simvar id with non-number value');
        }

        this.dataConsumer.subscribeToSimVar(name, unit, intId);
    }

    public processSetSimVarValueCommand(parts: readonly string[]): void {
        const requestId = parts[0];
        const intRequestId = parseInt(requestId);

        const name = parts[1];
        const unit = parts[2];

        const value = parts[3];
        const intValue = parseInt(value);

        this.dataConsumer.setSimVarValue(name, unit, intValue).then(() => {
            this.aircraftClient.sendMessage([AircraftCommandName.SIMVAR_SET_NOTIFY, intRequestId, 0]);
        }).catch(() => {
            this.aircraftClient.sendMessage([AircraftCommandName.SIMVAR_SET_NOTIFY, intRequestId, 1]);
        });
    }

}
