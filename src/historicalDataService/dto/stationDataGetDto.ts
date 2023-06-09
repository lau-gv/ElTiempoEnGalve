//Cambia que le quitamos el authStation xD.
interface StationDataGetDto { 
    //DatosDeFuera.
    stationId: string;
    datadatetime: number; 
    temperature: number;
    humidity: number; //%
    baromrelhpa: number;  //presion relativa (hpa)
    baromabshpa: number; //presion absoluta (hpa)
    rainrateinmm:number; //indica la tasa de precipitación actual en mm por hora.
    eventraininmm?: number; // cantidad total de lluvia desde el inicio del evento en mm (mm).
    hourlyraininmm: number;
    dailyraininmm: number;
    weeklyraininmm: number;
    monthlyraininmm: number;
    yearlyraininmm: number;
    winddir: number; // dirección del viento en grados (°) (59).
    windspeedkmh: number; //velocidad del viento en km por hora PROMEDIO durante 1 minuto (mph) (2.24).
    windguskmh: number; // ráfaga máxima de viento en km por hora (mph) (3.36).
    maxdailygust: number; //ráfaga máxima diaria de viento en km por hora (mph) (13.65).
    solarradiation: number; //radiación solar en vatios por metro cuadrado (W/m2) (567.79).
    uv: number; //índice ultravioleta (UV) (5).
    lowbatt: number; //estado de la batería de la estación meteorológica (0 indica que la batería está baja y 1 que está bien).
    freq?: number; //frecuencia de transmisión de la estación meteorológica en megahertz (MHz) (868M).
    model: number; //modelo de la estación meteorológica (WS2900_V2.01.18).
    interval: number; //intervalo de tiempo entre transmisiones de datos de la estación meteorológica en segundos (30).
    dewptfC?: number; //Punto de rocío en grados Celsius.
    windchillC?: number;
    //Datos de dentro:
    indoortempf: number; //Temperatura interior en grados Fahrenheit.
    indoorhumidity: number; //Humedad relativa interior en porcentaje (%).
};

export function stationDataToStationDataGetDto(stationData : StationData) : StationDataGetDto {
    return {
        stationId: stationData.stationId, 
        datadatetime: stationData.datadatetime, 
        temperature: stationData.temperature, 
        humidity: stationData.humidity, 
        baromrelhpa: stationData.baromrelhpa, 
        baromabshpa: stationData.baromabshpa, 
        rainrateinmm: stationData.rainrateinmm,
        eventraininmm: stationData.eventraininmm ? stationData.eventraininmm : undefined,
        hourlyraininmm: stationData.hourlyraininmm, 
        dailyraininmm: stationData.dailyraininmm, 
        weeklyraininmm: stationData.weeklyraininmm, 
        monthlyraininmm: stationData.monthlyraininmm, 
        yearlyraininmm: stationData.yearlyraininmm, 
        winddir: stationData.winddir, 
        windspeedkmh: stationData. windspeedkmh, 
        windguskmh: stationData. windguskmh, 
        maxdailygust: stationData.maxdailygust, 
        solarradiation: stationData.solarradiation, 
        uv: stationData. uv,
        lowbatt: stationData.lowbatt, 
        freq: stationData.freq ? stationData.freq : undefined, 
        model: stationData.model, 
        interval: stationData.interval, 
        dewptfC: stationData.dewptfC ? stationData.dewptfC : undefined,
        windchillC: stationData.windchillC ? stationData.windchillC : undefined,
        //Datos de dentro:
        indoortempf: stationData.indoortempf, 
        indoorhumidity: stationData.indoorhumidity,
    };
}