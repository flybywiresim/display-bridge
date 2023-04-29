import { RemoteDataConsumer, SimVarValueMap } from "./RemoteDataConsumer";
import { SimVarValue } from "../../shared/types";

export class DataCommandProcessor {
    constructor(
        private readonly dataConsumer: RemoteDataConsumer,
    ) {
    }

    public processSimVarValuesCommand(parts: readonly string[]): void {
        const values: SimVarValueMap = new Map<number, SimVarValue>();

        let currentId: number | null = null;
        for (let i = 0; i < parts.length; i++) {
            const isId = i % 2 === 0;

            const raw = parts[i];
            const valueRaw = JSON.parse(raw);

            if (isId) {
                if (Number.isFinite(valueRaw)) {
                    currentId = valueRaw;
                } else {
                    throw new Error('Processed simvar id with non-number value');
                }
            } else {
                if (!Number.isFinite(currentId)) {
                    throw new Error('Processed simvar value with null currentId ');
                }

                values.set(currentId, valueRaw);
            }
        }

        this.dataConsumer.consumeSimVarValues(values);
    }

    public processSimVarSetNotifyCommand(parts: readonly string[]): void {
        const requestId = parts[0];
        const intRequestId = parseInt(requestId);

        const successful = parts[1];
        const boolSuccessful = Boolean(successful);

        this.dataConsumer.acceptSimVarSetNotification(intRequestId, boolSuccessful);
    }

    public processCoherentTriggeredCommand(parts: readonly string[]): void {
        const event = parts[0];
0
        const data = [];
        for (let i = 1; i < parts.length; i++) {
            data.push(JSON.parse(parts[i]));
        }

        this.dataConsumer.acceptCoherentTriggered(event, data);
    }
}
