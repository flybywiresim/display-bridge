import { SimVarValue } from "../../shared/types";

export interface AircraftDataConsumer {
    subscribeToSimVar(name: string, unit: string, id: number): void

    getSimVarValue(name: string, unit: string): SimVarValue

    setSimVarValue(name: string, unit: string, value: SimVarValue): Promise<void>

    subscribeToCoherentEvent(name: string, requestID: number): void

    unsubscribeToCoherentEvent(requestID: number): void
}
