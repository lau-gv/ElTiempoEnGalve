
interface StationData { 
    //DatosDeFuera.
    id: string;
    datadatetime: string; 
    authStation: string; 
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
    windspeedkmh: number; //velocidad del viento en km por hora (mph) (2.24).
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