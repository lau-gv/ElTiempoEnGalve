export enum StationType{
    ecowitt = "ecowitt",
    wunderground = "wunderground",
}

export interface WeatherStationModel {
    userId: string;
    stationId: string;
    authStation: string;
    key: string ;
    name: string;
    location: string;
    type: string;
}
