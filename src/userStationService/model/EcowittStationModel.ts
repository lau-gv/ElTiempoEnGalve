import { StationType, WeatherStationModel } from "./WeatherStationModel";

export class EcowittStationModel implements WeatherStationModel {
    userId: string;
    stationId: string;
    authStation: string;
    name: string;
    location: string;
    type : string;
    key: string | undefined;

    constructor(
        userId: string,
        stationId: string,
        authStation: string,
        name: string,
        location: string,
      ) {
        this.userId = userId;
        this.stationId = stationId;
        this.authStation = authStation;
        this.name = name;
        this.location = location;
        this.type = StationType.ecowitt.valueOf();
    }

}
