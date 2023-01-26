import { RemoteDataConsumer, SimVarValueMap } from "./RemoteDataConsumer";

export class DataCommandProcessor {
    constructor(
        private readonly dataConsumer: RemoteDataConsumer,
    ) {
    }

    public processSimVarValuesCommand(parts: readonly string[]): void {
        const values: SimVarValueMap = {};

        let currentId: number | null = null;
        for (let i = 0; i < parts.length; i++) {
            const isId = i % 2 === 0;

            const raw = parts[i];
            const intRaw = parseInt(raw);

            if (isId) {
                if (intRaw) {
                    currentId = intRaw;
                } else {
                    throw new Error('Processed simvar id with non-number value');
                }
            } else {
                if (!currentId) {
                    throw new Error('Processed simvar value with null currentId ');
                }

                values[currentId] = intRaw;
            }
        }

        this.dataConsumer.consumeSimVarValues(values);
    }

}
