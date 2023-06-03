import { WeatherStationModel } from "../../model/WeatherStationModel";

export interface StationTaskCreate{
    createStation(data : any) : WeatherStationModel;
}

