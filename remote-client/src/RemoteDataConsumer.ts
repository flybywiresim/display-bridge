import { SimVarValue } from "../../shared/types";

export type SimVarValueMap = { [k: string]: SimVarValue }

export interface RemoteDataConsumer {
    consumeSimVarValues(values: SimVarValueMap): void
}
