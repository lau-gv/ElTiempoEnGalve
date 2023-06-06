import { getHistoricalDataDay, putHistoricalData } from "../../common/services/repository/HistoricalDataRepository/DynamoHistoricalDayData";
import { returnMaxValue, returnMinValue } from "../../common/utils/utils";

export async function updateHistoricalDayData(event: any, table_name: string){    
    try{
        const incomingData = JSON.parse(event.Payload.body) as StationData;
        const today= Math.trunc(incomingData.datadatetime / 100000);
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

//Probablemente esto no sea la mejor opción, porque provoco si o sí, que, si los datos no han variado,
//se haga una consulta a BD de forma innecesaria. 
//Sería mejor comprobar que TODOS los datos han cambmiado, han cambiado? pues insertamos, 
//pero io que se, son muchos y voy mal de tiempo :(. 
//También hago muchísimas comparaciones que convendría separar en funciones?

function getMaxMinValues(actualHistoricalData : HistoricalDataDay, incomingData : StationData) {
    
    const historicalData : HistoricalDataDay = {
        stationId: actualHistoricalData.stationId,
        datadate: actualHistoricalData.datadate,

        maxTemperature: returnMaxValue(actualHistoricalData.maxTemperature, incomingData.temperature),

        minTemperature: returnMinValue(actualHistoricalData.minTemperature, incomingData.temperature),

        maxHumidity: returnMaxValue(actualHistoricalData.maxHumidity, incomingData.humidity),

        minHumidity: returnMinValue(actualHistoricalData.minHumidity, incomingData.humidity),

        maxBaromrelhpa: returnMaxValue(actualHistoricalData.maxBaromrelhpa, incomingData.baromabshpa),

        minBaromrelhpa: returnMinValue(actualHistoricalData.minBaromrelhpa, incomingData.baromabshpa),

        maxBaromabshpa: returnMaxValue(actualHistoricalData.maxBaromabshpa, incomingData.baromrelhpa),

        minBaromabshpa: returnMinValue(actualHistoricalData.maxBaromabshpa, incomingData.baromrelhpa), 

        maxRainrateinmm: returnMaxValue(actualHistoricalData.maxRainrateinmm, incomingData.rainrateinmm),

        minRainrateinmm: returnMinValue(actualHistoricalData.minRainrateinmm, incomingData.rainrateinmm), 

        acumulateDailyraininmm: incomingData.dailyraininmm, 

        maxdailygust: returnMaxValue(actualHistoricalData.maxdailygust, incomingData.maxdailygust),

        maxSolarradiation: returnMaxValue(actualHistoricalData.maxSolarradiation, incomingData.solarradiation), 

        minSolarradiation: returnMinValue(actualHistoricalData.minSolarradiation, incomingData.solarradiation),

        maxUv: returnMaxValue(actualHistoricalData.maxUv, incomingData.uv), 
  
        minUv: returnMinValue(actualHistoricalData.minUv, incomingData.uv),

        //Datos de dentro:
        maxIndoortemp: returnMaxValue(actualHistoricalData.maxIndoortemp, incomingData.indoortempf),

        minIndoortemp: returnMinValue(actualHistoricalData.minIndoortemp, incomingData.indoortempf),

        maxIndoorhumidity: returnMaxValue(actualHistoricalData.maxIndoorhumidity, incomingData.indoorhumidity), 

        minIndoorhumidity: returnMinValue(actualHistoricalData.minIndoorhumidity, incomingData.indoorhumidity), 

    };

    return historicalData;
}

function stationDataToHistoricalData(incomingData : StationData) {
    
    const historicalData : HistoricalDataDay = {
        stationId: incomingData.stationId,
        datadate: Math.trunc(incomingData.datadatetime / 100000),
        maxTemperature: incomingData.temperature,
        minTemperature: incomingData.temperature, 
        maxHumidity: incomingData.humidity, 
        minHumidity: incomingData.humidity,
        maxBaromrelhpa: incomingData.baromabshpa,
        minBaromrelhpa: incomingData.baromabshpa,
        maxBaromabshpa: incomingData.baromrelhpa, 
        minBaromabshpa: incomingData.baromrelhpa,
        maxRainrateinmm: incomingData.rainrateinmm,
        minRainrateinmm: incomingData.rainrateinmm,
        acumulateDailyraininmm: incomingData.dailyraininmm, 
        maxdailygust: incomingData.maxdailygust,
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



