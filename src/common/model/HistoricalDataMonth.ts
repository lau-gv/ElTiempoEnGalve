interface HistoricalDataMonth { 
    //DatosDeFuera.
    datadate: number;
    stationId: string;
    year: number;
    month: number;
    maxTemperature: number;
    minTemperature: number;
    maxHumidity: number; //%
    minHumidity: number; //%
    maxBaromrelhpa: number;  //presion relativa (hpa)
    minBaromrelhpa: number;  //presion relativa (hpa)
    maxBaromabshpa: number; //presion absoluta (hpa)
    minBaromabshpa: number; //presion absoluta (hpa)
    maxRainrateinmm:number; //indica la tasa de precipitación actual en mm por hora. //indica la tasa de precipitación actual en mm por hora.
    minRainrateinmm:number; //indica la tasa de precipitación actual en mm por hora. //indica la tasa de precipitación actual en mm por hora.
    acumulateDailyraininmm: number; // dirección del viento en grados (°) (59).
    maxwindspeedkmh: number; //ráfaga máxima diaria de viento en km por hora (mph) (13.65).
    minwindspeedkmh: number; //ráfaga máxima diaria de viento en km por hora (mph) (13.65).
    maxdailygust: number; //ráfaga máxima diaria de viento en km por hora (mph) (13.65).
    mindailygust: number; 
    maxSolarradiation: number; //radiación solar en vatios por metro cuadrado (W/m2) (567.79).
    minSolarradiation: number; //radiación solar en vatios por metro cuadrado (W/m2) (567.79).
    maxUv: number; //índice ultravioleta (UV) (5).
    minUv: number; //índice ultravioleta (UV) (5).
    //Datos de dentro:
    maxIndoortemp: number; //Temperatura interior en grados C.
    minIndoortemp: number; //Temperatura interior en grados C.
    maxIndoorhumidity: number; //Humedad relativa interior en porcentaje (%).
    minIndoorhumidity: number; //Humedad relativa interior en porcentaje (%).
};