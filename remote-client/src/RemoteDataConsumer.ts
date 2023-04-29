import { SimVarValue } from "../../shared/types";

export type SimVarValueMap = Map<number, SimVarValue>

export interface RemoteDataConsumer {
    consumeSimVarValues(values: SimVarValueMap): void

    acceptSimVarSetNotification(requestID: number, successful: boolean): void

    acceptCoherentTriggered(event: string, data: any[]): void
}
