import { StationType, WeatherStationModel } from "../../model/WeatherStationModel";
import { StationTaskUpdate } from "../stationTasks/stationTasks";
import { updateEcowitStation } from "./updateEcowittStation";
import { updateWundergroundStation } from "./updateWundergroundStation";

export function updateStationManager(data : WeatherStationModel) : WeatherStationModel {
    const typeToLower : string = data.type;
    let stationTypesCreations = new Map<string, StationTaskUpdate>([
        [StationType.ecowitt.valueOf(), updateEcowitStation(data)],
        [StationType.wunderground.valueOf(), updateWundergroundStation(data)],
    ]);

    return stationTypesCreations.get(typeToLower)!.updateStation(data);
}