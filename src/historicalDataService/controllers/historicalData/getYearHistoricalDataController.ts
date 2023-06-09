import { APIGatewayProxyEvent } from "aws-lambda";
import { getHistoricalDataBetweenCommon } from "./getHistoricalDataBetweenDate";
import { handleError, UnexpectedFieldError, MissingFieldError } from "../../../common/utils/Validator";

export async function getYearHistoricalData(event: APIGatewayProxyEvent, tableName : string){
  
  try{
    const historicalDatasDay =  await getHistoricalDataBetweenCommon(event, tableName, validateData, returnStartDate, returnEndDate);
    console.log(historicalDatasDay);
    var result : Map<number, HistoricalDataMonth>;
    if(historicalDatasDay){
        console.log("estoy dentro del if, así que voy a  calcular los datos")
        result = calculateMaxMinsByMonth(historicalDatasDay); 
    }
    
    return {
      statusCode: 200, 
      body: JSON.stringify((historicalDatasDay ? (Object.fromEntries(result!)) : historicalDatasDay)),
      headers: {
          'Content-Type': 'application/json',
      }
  };

  }catch(error : any){
    return handleError(error);
  }
}

function returnStartDate(yyyy : string) : string {
  return yyyy.concat("0101");
}

function returnEndDate(yyyy : string) : string {
  return yyyy.concat("1231");
}

function validateData(event: APIGatewayProxyEvent) {
  const allowedFields = ['stationId', 'datadate'];
  //Se espera YYYYMM año y mes.
  const dataDateRegex = /^\d{4}$/;

  const arg = event.queryStringParameters;

  if (!arg) {
    throw new Error('No se encontraron parámetros en la solicitud');
  }

  for (const field in arg) {
    if (!allowedFields.includes(field)) {
      throw new UnexpectedFieldError(`${field}`);
    }
  }

  if (!arg.stationId) {
    throw new MissingFieldError('stationId');
  }

  if (!arg.datadate || !dataDateRegex.test(arg.datadate)) {
    throw new MissingFieldError('month');
  }
}

//Se me queda la algoritmia coja aquí. Orden O(n)
function calculateMaxMinsByMonth(historicalDatasDay : HistoricalDataDay[]): Map<number, HistoricalDataMonth>{

  var map  = new Map<number, HistoricalDataMonth>();

  var i = 0;
  historicalDatasDay.forEach(element => {
    i++;
    const month : number = element.month;
    const actualHistoricalDataDay = map.get(month);
    actualHistoricalDataDay 
      ? map.set(month, getMaxMin(actualHistoricalDataDay, element))
      : map.set(month, historicalDataDayToHistoricalDataMonth(element));
    console.log(`estamos en la iteración: ${i} y el mes es: ${month} `);
    const prueba : HistoricalDataMonth = map.get(month)!;
    console.log(prueba);
    console.log(map.size);
    console.log(actualHistoricalDataDay);
  });
  return map;
};

function getMaxMin(actualHistoricalDataDay : HistoricalDataMonth, element : HistoricalDataDay) : HistoricalDataMonth {  
  return  {
    stationId: actualHistoricalDataDay.stationId,
    datadate: actualHistoricalDataDay.datadate,
    year: actualHistoricalDataDay.year,
    month: actualHistoricalDataDay.month,
    maxTemperature: Math.max(actualHistoricalDataDay.maxTemperature, element.maxTemperature),
    minTemperature: Math.min(actualHistoricalDataDay.minTemperature, element.minTemperature),
    maxHumidity: Math.max(actualHistoricalDataDay.maxHumidity, element.maxHumidity),
    minHumidity: Math.min(actualHistoricalDataDay.minTemperature, element.minTemperature),
    maxBaromrelhpa: Math.max(actualHistoricalDataDay.maxBaromrelhpa, element.maxBaromrelhpa),
    minBaromrelhpa: Math.min(actualHistoricalDataDay.minBaromrelhpa, element.minBaromrelhpa),
    maxBaromabshpa: Math.max(actualHistoricalDataDay.maxBaromabshpa, element.maxBaromabshpa),
    minBaromabshpa: Math.min(actualHistoricalDataDay.minBaromabshpa, element.minBaromabshpa),
    maxRainrateinmm: Math.max(actualHistoricalDataDay.maxRainrateinmm, element.maxRainrateinmm),
    minRainrateinmm: Math.min(actualHistoricalDataDay.minRainrateinmm, element.minRainrateinmm),
    acumulateDailyraininmm: Math.max(actualHistoricalDataDay.acumulateDailyraininmm, element.acumulateDailyraininmm),
    maxdailygust: Math.max(actualHistoricalDataDay.maxdailygust, element.maxdailygust),
    maxSolarradiation: Math.max(actualHistoricalDataDay.maxSolarradiation, element.maxSolarradiation),
    minSolarradiation: Math.min(actualHistoricalDataDay.minSolarradiation, element.minSolarradiation),
    maxUv: Math.max(actualHistoricalDataDay.maxUv, element.maxUv),
    minUv: Math.min(actualHistoricalDataDay.minUv, element.minUv),
    //Datos de dentro:
    maxIndoortemp: Math.max(actualHistoricalDataDay.maxIndoortemp, element.maxIndoortemp),
    minIndoortemp: Math.min(actualHistoricalDataDay.minIndoortemp, element.minIndoortemp),
    maxIndoorhumidity: Math.max(actualHistoricalDataDay.maxIndoorhumidity, element.maxIndoorhumidity),
    minIndoorhumidity: Math.min(actualHistoricalDataDay.minIndoorhumidity, element.minIndoorhumidity),
  };
}

function historicalDataDayToHistoricalDataMonth(element : HistoricalDataDay) : HistoricalDataMonth {  
  return  {
    stationId: element.stationId,
    datadate: parseInt(element.datadate.toString().substring(0,6)),
    year: element.year,
    month: element.month,
    maxTemperature: element.maxTemperature,
    minTemperature: element.minTemperature,
    maxHumidity: element.maxHumidity,
    minHumidity: element.minTemperature,
    maxBaromrelhpa: element.maxBaromrelhpa,
    minBaromrelhpa: element.minBaromrelhpa,
    maxBaromabshpa: element.maxBaromabshpa,
    minBaromabshpa: element.minBaromabshpa,
    maxRainrateinmm: element.maxRainrateinmm,
    minRainrateinmm: element.minRainrateinmm,
    acumulateDailyraininmm: element.acumulateDailyraininmm,
    maxdailygust: element.maxdailygust,
    maxSolarradiation: element.maxSolarradiation,
    minSolarradiation: element.minSolarradiation,
    maxUv: element.maxUv,
    minUv: element.minUv,
    //Datos de dentro:
    maxIndoortemp: element.maxIndoortemp,
    minIndoortemp: element.minIndoortemp,
    maxIndoorhumidity: element.maxIndoorhumidity,
    minIndoorhumidity: element.minIndoorhumidity,
  };
}

