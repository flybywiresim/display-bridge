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
                if (valueRaw) {
                    currentId = valueRaw;
                } else {
                    throw new Error('Processed simvar id with non-number value');
                }
            } else {
                if (!currentId) {
                    throw new Error('Processed simvar value with null currentId ');
                }

                values.set(currentId, valueRaw);
            }
        }

        this.dataConsumer.consumeSimVarValues(values);
    }

}
