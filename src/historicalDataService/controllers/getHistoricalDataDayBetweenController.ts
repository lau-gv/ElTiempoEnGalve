import { APIGatewayProxyEvent } from "aws-lambda";
import { IncompleteBodyError, MissingFieldError, UnexpectedFieldError, handleError } from "../../common/utils/Validator";
import { getAllStationsByUserDynamo } from "../../common/services/repository/EstacionRepository/DynamoStationDB";
import { validateAsGetPeticion } from "./validatorGetData";
import { getHistoricalDataDay } from "../../common/services/repository/HistoricalDataRepository/DynamoHistoricalDayData";
import { getHistoricalDataBetweenCommon } from "./getHistoricalDataBetweenDate";

export async function getBetweenHistoricalDataDayController(event: APIGatewayProxyEvent, tableName : string){
  
  try{
    const historicalDatasDay =  await getHistoricalDataBetweenCommon(event, tableName, validateData, returnStartDate, returnEndDate);
    return {
      statusCode: 200, 
      body: JSON.stringify((historicalDatasDay)),
      headers: {
          'Content-Type': 'application/json',
      }
  };

  }catch(error : any){
    return handleError(error);
  }
}

function returnStartDate(yyyymmdd : string) : string {
  return yyyymmdd;
}

function returnEndDate(yyyymmdd : string) : string {
  return yyyymmdd;
}

function validateData(event: APIGatewayProxyEvent) {
  const allowedFields = ['stationId', 'startDay', 'endDay' ];
  //Se espera YYYYMMDD año y mes.
  const dataDateRegex = /^\d{8}$/;

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
