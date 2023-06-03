
//Vamoh a ver, si no puedo definir los atributos como privados apaga y vamonos :(

import { StationType, WeatherStationModel } from "./WeatherStationModel";

//E E E ENCAPSULACIÓN E E E!!!!!! :(
export class WundergroundStation implements WeatherStationModel {
    userId: string;
    stationId: string;
    authStation: string;
    key: string;
    name: string;
    location: string;
    type : string;

    constructor(
        userId: string,
        stationId: string,
        authStation: string,
        key: string ,
        name: string,
        location: string,
      ) {
        this.userId = userId;
        this.stationId = stationId;
        this.authStation = authStation;
        this.key = key;
        this.name = name;
        this.location = location;
        this.type = StationType.wunderground.valueOf();
    }
}