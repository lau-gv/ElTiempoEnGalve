export enum StationType{
    ecowitt = "ecowitt",
    wunderground = "wunderground",
}

export interface WeatherStationModel {
    userId: string;
    stationId: string;
    authStation: string;
    key: string | undefined;
    name: string;
    location: string;
    type: string;
}
