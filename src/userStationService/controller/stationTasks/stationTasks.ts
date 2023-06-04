import { WeatherStationModel } from "../../model/WeatherStationModel";

export interface StationTaskCreate{
    createStation(data : any) : WeatherStationModel;
}

export interface StationTaskUpdate{
    updateStation(data : any) : WeatherStationModel;
}


