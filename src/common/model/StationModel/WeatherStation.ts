interface WeatherStation{
    receiveIdentifier: string;
    getAuth(): string;
    formatData(stationId: string, parsedData: any): any;
}

interface Station {
    user: string;
    id: string;
    authStation: string;
    nombre: string;
    localizacion: {
        "latitud": number,
        "longitud": number,
    };
    tipo: string;
}
