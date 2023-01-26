import { SimVarValue } from "../../shared/types";

export type SimVarValueMap = Map<number, SimVarValue>

export interface RemoteDataConsumer {
    consumeSimVarValues(values: SimVarValueMap): void
}
