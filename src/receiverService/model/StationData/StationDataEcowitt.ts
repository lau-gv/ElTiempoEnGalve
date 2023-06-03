/**En realidad no se utiliza. Pero me es util */
interface stationDataEcowitt{
    PASSKEY: string;
    stationtype: string;
    runtime: number;
    dateutc: string;
    tempinf: number;
    humidityin: number;
    baromrelin: number;
    baromabsin: number;
    tempf: number;
    humidity: number;
    winddir: number;
    windspeedmph: number;
    windgustmph: number;
    maxdailygust: number;
    solarradiation: number;
    uv: number;
    rainratein: number;
    eventrainin: number;
    hourlyrainin: number;
    dailyrainin: number;
    weeklyrainin: number;
    monthlyrainin: number;
    yearlyrainin: number;
    totalrainin: number;
    wh65batt: number;
    freq: string;
    model: string;
    interval: number;
}

/**
 * There are quite a number of fields:

    PASSKEY: clave de acceso a la API de Ecotwitt.
    stationtype: tipo de estación meteorológica (EasyWeatherPro_V5.1.1).
    runtime: tiempo de ejecución de la estación meteorológica en minutos (2).
    dateutc: fecha y hora en formato UTC (2023-04-02 09:32:06).
    tempinf: temperatura interior en grados Fahrenheit (°F) (61.7).
    humidityin: humedad interior en porcentaje (%) (42).
    baromrelin: presión barométrica relativa en pulgadas de mercurio (inHg) (29.929).
    baromabsin: presión barométrica absoluta en pulgadas de mercurio (inHg) (26.246).
    tempf: temperatura exterior en grados Fahrenheit (°F) (43.7).
    humidity: humedad exterior en porcentaje (%) (72).
    winddir: dirección del viento en grados (°) (59).
    windspeedmph: velocidad del viento en millas por hora (mph) (2.24).
    windgustmph: ráfaga máxima de viento en millas por hora (mph) (3.36).
    maxdailygust: ráfaga máxima diaria de viento en millas por hora (mph) (13.65).
    solarradiation: radiación solar en vatios por metro cuadrado (W/m2) (567.79).
    uv: índice ultravioleta (UV) (5).
    rainratein: tasa de lluvia actual en pulgadas por hora (in/h) (0.000).
    eventrainin: cantidad total de lluvia desde el inicio del evento en pulgadas (in) (0.000).
    hourlyrainin: cantidad total de lluvia en la última hora en pulgadas (in) (0.000).
    dailyrainin: cantidad total de lluvia en el día actual en pulgadas (in) (0.012).
    weeklyrainin: cantidad total de lluvia en la semana actual en pulgadas (in) (0.012).
    monthlyrainin: cantidad total de lluvia en el mes actual en pulgadas (in) (0.091).
    yearlyrainin: cantidad total de lluvia en el año actual en pulgadas (in) (7.020).
    totalrainin: cantidad total de lluvia registrada desde la instalación de la estación meteorológica en pulgadas (in) (7.020).
    wh65batt: estado de la batería de la estación meteorológica (0 indica que la batería está baja y 1 que está bien).
    freq: frecuencia de transmisión de la estación meteorológica en megahertz (MHz) (868M).
    model: modelo de la estación meteorológica (WS2900_V2.01.18).
    interval: intervalo de tiempo entre transmisiones de datos de la estación meteorológica en segundos (30).

 */