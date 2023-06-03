interface WeatherStation{
    receiveIdentifier: string;
    getAuth(): string;
    formatData(stationId: string, parsedData: any): any;
}
