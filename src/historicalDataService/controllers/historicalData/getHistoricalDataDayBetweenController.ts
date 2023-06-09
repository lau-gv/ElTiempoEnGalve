import { APIGatewayProxyEvent } from "aws-lambda";
import { handleError, UnexpectedFieldError, MissingFieldError } from "../../../common/utils/Validator";
import { getHistoricalDataBetweenCommon } from "./getHistoricalDataBetweenDate";
import { getHistoricalDataDayBetween } from "../../../common/services/repository/HistoricalDataRepository/DynamoHistoricalDayData";

export async function getBetweenHistoricalDataDayController(event: APIGatewayProxyEvent, tableName : string){
  
  try{
    
    validateData(event);

    const startDatadate = event.queryStringParameters!['startDay']!;;
    const endDatadate = event.queryStringParameters!['endDay']!;
    const stationId = event.queryStringParameters!['stationId']!;
    const historicalDatasDay = await getHistoricalDataDayBetween(tableName, stationId!, startDatadate, endDatadate);

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

  if (!arg.startDay || !dataDateRegex.test(arg.startDay)) {
    throw new MissingFieldError('startDay');
  }

  if (!arg.endDay || !dataDateRegex.test(arg.endDay)) {
    throw new MissingFieldError('endDay');
  }
  }
