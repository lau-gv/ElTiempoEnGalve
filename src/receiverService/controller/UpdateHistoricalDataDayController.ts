import { getHistoricalDataDay, putHistoricalData } from "../../common/services/repository/HistoricalDataRepository/DynamoHistoricalDayData";

export async function updateHistoricalDayData(event: any, table_name: string){    
    try{
        const incomingData = JSON.parse(event.Payload.body) as StationData;
        const today= datadatetimeToYYYYMM(incomingData.datadatetime);
        const actualHistoricalData = await getHistoricalDataDay(table_name, today, incomingData.stationId);
        var newHistoricalData : HistoricalDataDay = (actualHistoricalData) 
            ? getMaxMinValues(actualHistoricalData, incomingData)
            : stationDataToHistoricalData(incomingData);

        console.log(newHistoricalData);
        await putHistoricalData(table_name, newHistoricalData);
        
        return  {
            "statusCode": 201,
            "body": incomingData
        };
    }catch(Error: any){

        /*¿Por qué no controlo este error aquí? Porque quiero que lo controle step functions
        y no mi código, así, si algo de la inserción de datos falla, se marca como que ha fallado.
        Si quien leyese fuese una función lambda, el mensaje se devolvería a la cola y habría manejo de errores 
        de forma integrada, pero, al estar lanzando step functions, no sé que pasa. EN PENDIENTES MANEJO DE ERRORES*/
        console.log(`Errorcito!: ${Error.message}`);
        throw new Error(`${Error.message}`);
    }
}

//YYYYMMDD
function datadatetimeToYYYYMM(datadatetime : number) : number{
    return parseInt(datadatetime.toString().substring(0,8));
}

function getYear(actualHistoricalData: number): number {
    return parseInt(actualHistoricalData.toString().substring(0,4));
}
function getMonth(actualHistoricalData: number): number {
    const month =  parseInt(actualHistoricalData.toString().substring(4,6));
    return month
}
function getDay(actualHistoricalData: number): number {
    const day = parseInt(actualHistoricalData.toString().substring(6,8));
    console.log(day);
    return day;
}

//Probablemente esto no sea la mejor opción, porque provoco si o sí, que, si los datos no han variado,
//se haga una consulta a BD de forma innecesaria. 
//Sería mejor comprobar que TODOS los datos han cambmiado, han cambiado? pues insertamos, 
//pero io que se, son muchos y voy mal de tiempo :(. 
//También hago muchísimas comparaciones que convendría separar en funciones?

function getMaxMinValues(actualHistoricalData : HistoricalDataDay, incomingData : StationData) {
    
    const historicalData : HistoricalDataDay = {
        stationId: actualHistoricalData.stationId,
        datadate: actualHistoricalData.datadate,
        year: getYear(actualHistoricalData.datadate),
        month: getMonth(actualHistoricalData.datadate),
        day: getDay(actualHistoricalData.datadate),
        maxTemperature: Math.max(actualHistoricalData.maxTemperature, incomingData.temperature),

        minTemperature: Math.min(actualHistoricalData.minTemperature, incomingData.temperature),

        maxHumidity: Math.max(actualHistoricalData.maxHumidity, incomingData.humidity),

        minHumidity: Math.min(actualHistoricalData.minHumidity, incomingData.humidity),

        maxBaromrelhpa: Math.max(actualHistoricalData.maxBaromrelhpa, incomingData.baromrelhpa),

        minBaromrelhpa: Math.min(actualHistoricalData.minBaromrelhpa, incomingData.baromrelhpa),

        maxBaromabshpa: Math.max(actualHistoricalData.maxBaromabshpa, incomingData.baromabshpa),

        minBaromabshpa: Math.min(actualHistoricalData.maxBaromabshpa, incomingData.baromabshpa), 

        maxRainrateinmm: Math.max(actualHistoricalData.maxRainrateinmm, incomingData.rainrateinmm),

        minRainrateinmm: Math.min(actualHistoricalData.minRainrateinmm, incomingData.rainrateinmm), 

        acumulateDailyraininmm: incomingData.dailyraininmm, 

        maxwindspeedkmh: Math.max(actualHistoricalData.maxwindspeedkmh, incomingData.windspeedkmh), 
        
        minwindspeedkmh: Math.min(actualHistoricalData.minwindspeedkmh, incomingData.windspeedkmh),        

        maxdailygust: Math.max(actualHistoricalData.maxdailygust, incomingData.maxdailygust),

        mindailygust: Math.min(actualHistoricalData.mindailygust, incomingData.maxdailygust), 

        maxSolarradiation: Math.max(actualHistoricalData.maxSolarradiation, incomingData.solarradiation), 

        minSolarradiation: Math.min(actualHistoricalData.minSolarradiation, incomingData.solarradiation),

        maxUv: Math.max(actualHistoricalData.maxUv, incomingData.uv), 
  
        minUv: Math.min(actualHistoricalData.minUv, incomingData.uv),

        //Datos de dentro:
        maxIndoortemp: Math.max(actualHistoricalData.maxIndoortemp, incomingData.indoortempf),

        minIndoortemp: Math.min(actualHistoricalData.minIndoortemp, incomingData.indoortempf),

        maxIndoorhumidity: Math.max(actualHistoricalData.maxIndoorhumidity, incomingData.indoorhumidity), 

        minIndoorhumidity: Math.min(actualHistoricalData.minIndoorhumidity, incomingData.indoorhumidity), 

    };

    return historicalData;
}

//YYYYMMDD

function stationDataToHistoricalData(incomingData : StationData) {
    
    const historicalData : HistoricalDataDay = {
        stationId: incomingData.stationId,
        datadate: datadatetimeToYYYYMM(incomingData.datadatetime),
        year: getYear(datadatetimeToYYYYMM(incomingData.datadatetime)),
        month: getMonth(datadatetimeToYYYYMM(incomingData.datadatetime)),
        day: getDay(datadatetimeToYYYYMM(incomingData.datadatetime)),
        maxTemperature: incomingData.temperature,
        minTemperature: incomingData.temperature, 
        maxHumidity: incomingData.humidity, 
        minHumidity: incomingData.humidity,
        maxBaromrelhpa: incomingData.baromrelhpa,
        minBaromrelhpa: incomingData.baromrelhpa,
        maxBaromabshpa: incomingData.baromabshpa, 
        minBaromabshpa: incomingData.baromabshpa,
        maxRainrateinmm: incomingData.rainrateinmm,
        minRainrateinmm: incomingData.rainrateinmm,
        acumulateDailyraininmm: incomingData.dailyraininmm, 
        maxwindspeedkmh: incomingData.windspeedkmh, 
        minwindspeedkmh: incomingData.windspeedkmh,      
        maxdailygust: incomingData.maxdailygust,
        mindailygust: incomingData.maxdailygust, 
        maxSolarradiation: incomingData.solarradiation ,
        minSolarradiation: incomingData.solarradiation, 
        maxUv:incomingData.uv,
        minUv: incomingData.uv,
        //Datos de dentro:
        maxIndoortemp: incomingData.indoortempf,
        minIndoortemp: incomingData.indoortempf,
        maxIndoorhumidity: incomingData.indoorhumidity,
        minIndoorhumidity: incomingData.indoorhumidity, 
    };

    return historicalData;
}



