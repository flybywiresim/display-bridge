import { SimVarValue } from "../../shared/types";

export interface AircraftDataConsumer {
    subscribeToSimVar(name: string, unit: string, id: number): void

    setSimVarValue(name: string, unit: string, value: SimVarValue): Promise<void>
}
