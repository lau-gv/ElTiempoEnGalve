import { StationType, WeatherStationModel } from "../../model/WeatherStationModel";
import { StationTaskCreate } from "../stationTasks/stationTasks";
import { createEcowitStation } from "./createEcowittStation";
import { createWundergroundStation } from "./createWundergroundStation";

export function createStationManager(data : WeatherStationModel) : WeatherStationModel {
    const typeToLower : string = data.type;
    let stationTypesCreations = new Map<string, StationTaskCreate>([
        [StationType.ecowitt.valueOf(), createEcowitStation(data)],
        [StationType.wunderground.valueOf(), createWundergroundStation(data)],
    ]);

    return stationTypesCreations.get(typeToLower)!.createStation(data);
}