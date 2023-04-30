interface StationDataWunderground {
    ID: string;
    PASSWORD: string;
    tempf: number;
    humidity: number;
    dewptf: number;
    windchillf: number;
    winddir: number;
    windspeedmph: number;
    windgustmph: number;
    rainin: number;
    dailyrainin: number;
    weeklyrainin: number;
    monthlyrainin: number;
    yearlyrainin: number;
    totalrainin: number;
    solarradiation: number;
    UV: number;
    indoortempf: number;
    indoorhumidity: number;
    absbaromin: number;
    baromin: number;
    lowbatt: number;
    dateutc: string;
    softwaretype: string;
    action: string;
    realtime: number;
    rtfreq: number;
}

/*
    ID: Identificación de la estación meteorológica.
    PASSWORD: Contraseña para acceder a la cuenta de Wunderground.
    tempf: Temperatura en grados Fahrenheit.
    humidity: Humedad relativa en porcentaje (%).
    dewptf: Punto de rocío en grados Fahrenheit.
    windchillf: Sensación térmica en grados Fahrenheit.
    winddir: Dirección del viento en grados.
    windspeedmph: Velocidad del viento en millas por hora (mph).
    windgustmph: Ráfaga máxima del viento en millas por hora (mph).
    rainin: Cantidad de lluvia en pulgadas (in) en la última hora.
    dailyrainin: Cantidad total de lluvia acumulada en pulgadas (in) en el día.
    weeklyrainin: Cantidad total de lluvia acumulada en pulgadas (in) en la semana.
    monthlyrainin: Cantidad total de lluvia acumulada en pulgadas (in) en el mes.
    yearlyrainin: Cantidad total de lluvia acumulada en pulgadas (in) en el año.
    totalrainin: Cantidad total de lluvia acumulada en pulgadas (in) desde el inicio de la medición.
    solarradiation: Radiación solar en vatios por metro cuadrado (W/m²).
    UV: Índice de radiación ultravioleta.
    indoortempf: Temperatura interior en grados Fahrenheit.
    indoorhumidity: Humedad relativa interior en porcentaje (%).
    absbaromin: Presión barométrica absoluta en pulgadas de mercurio (inHg).
    baromin: Presión barométrica ajustada al nivel del mar en pulgadas de mercurio (inHg).
    lowbatt: Indicador de batería baja de la estación meteorológica.
    dateutc: Fecha y hora en formato UTC.
    softwaretype: Tipo de software utilizado para enviar los datos.
    action: Acción que se está realizando, en este caso, actualización de datos.
    realtime: Indicador de si los datos son en tiempo real o no (1 para verdadero y 0 para falso).
    rtfreq: Frecuencia en minutos para actualizar los datos en tiempo real.
*/
/*
ID: [ 'dhjd' ],
    PASSWORD: [ '1234' ],
    UV: [ '0' ],
    absbaromin: [ '26.167' ],
    action: [ 'updateraw' ],
    baromin: [ '29.958' ],
    dailyrainin: [ '0.000' ],
    dateutc: [ 'now' ],
    dewptf: [ '42.3' ],
    humidity: [ '69' ],
    indoorhumidity: [ '42' ],
    indoortempf: [ '66.4' ],
    lowbatt: [ '0' ],
    monthlyrainin: [ '0.272' ],
    rainin: [ '0.000' ],
    realtime: [ '1' ],
    rtfreq: [ '5' ],
    softwaretype: [ 'EasyWeatherPro_V5.1.1' ],
    solarradiation: [ '0.00' ],
    tempf: [ '52.2' ],
    totalrainin: [ '7.201' ],
    weeklyrainin: [ '0.012' ],
    windchillf: [ '52.2' ],
    winddir: [ '178' ],
    windgustmph: [ '0.00' ],
    windspeedmph: [ '0.00' ],
    yearlyrainin: [ '-9999' ]*/