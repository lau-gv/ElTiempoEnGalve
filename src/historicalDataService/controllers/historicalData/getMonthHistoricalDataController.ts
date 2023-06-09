import { APIGatewayProxyEvent } from "aws-lambda";
import { handleError, UnexpectedFieldError, MissingFieldError } from "../../../common/utils/Validator";
import { getHistoricalDataBetweenCommon } from "./getHistoricalDataBetweenDate";


export async function getMonthHistoricalData(event: APIGatewayProxyEvent, tableName : string){
  
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

function returnStartDate(yyyymm : string) : string {
  return yyyymm.concat("01");
}

function returnEndDate(yyyymm : string) : string {
  return yyyymm.concat("31");
}

function validateData(event: APIGatewayProxyEvent) {
  const allowedFields = ['stationId', 'datadate'];
  //Se espera YYYYMM año y mes.
  const dataDateRegex = /^\d{6}$/;

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
    throw new MissingFieldError('datadate');
  }
  }
