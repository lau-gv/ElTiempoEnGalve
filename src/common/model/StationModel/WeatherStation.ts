interface WeatherStation{
    receiveIdentifier: string;
    getAuth(): string;
    formatData(stationId: string, parsedData: any): any;
}

interface Station {
    userId: string;
    id: string;
    authStation: string;
    name: string;
    location: string;
    type: string;
}

